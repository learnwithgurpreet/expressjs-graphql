const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Event = require("./models/event");
const User = require("./models/user");

const app = express();

app.use(bodyParser.json());

const events = [];

app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type User {
      _id: ID!
      email: String!
      password: String
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input UserInput {
      email: String!
      password: String!
    }

    type RootQuery {
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
      createUser(userInput: UserInput): User
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
    rootValue: {
      events: () => {
        return Event.find()
          .then((events) => events)
          .catch((err) => {
            throw err;
          });
      },
      createEvent: (args) => {
        const { title, description, price, date } = args.eventInput;
        const event = new Event({
          title,
          description,
          price: +price,
          date,
          creator: "633d334e26a1bfc9b1b245de",
        });
        let createdEvent;
        return event
          .save()
          .then((result) => {
            createdEvent = result;
            return User.findById("633d334e26a1bfc9b1b245de");
          })
          .then((user) => {
            if (!user) {
              throw new Error("User not found!");
            }
            user.createdEvents.push(event);
            return user.save();
          })
          .then((result) => createdEvent)
          .catch((err) => console.log(err));
      },
      createUser: (args) => {
        const { email, password } = args.userInput;
        return User.findOne({ email })
          .then((user) => {
            if (user) {
              throw new Error("User exists already!");
            }
            return bcrypt.hash(password, 12);
          })
          .then((hashedPassword) => {
            const user = new User({
              email,
              password: hashedPassword,
            });
            return user.save();
          })
          .then((result) => {
            return { ...result._doc, password: null };
          })
          .catch((err) => {
            throw err;
          });
      },
    },
    graphiql: true,
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.3iq5s.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`
  )
  .then(() => {
    app.listen(3000);
  })
  .catch((err) => console.log(err));
