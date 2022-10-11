const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const isAuth = require("./middleware/is-auth");

const graphqlSchema = require("./graphql/schema/index");
const graphqlResolver = require("./graphql/resolver/index");

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(isAuth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
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
