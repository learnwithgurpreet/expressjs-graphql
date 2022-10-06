const bcrypt = require("bcryptjs");

const Event = require("../../models/event");
const User = require("../../models/user");

const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    events.map((event) => {
      return {
        ...event._doc,
        date: new Date(event.date).toISOString(),
        creator: user.bind(this, event.creator),
      };
    });
    return events;
  } catch (error) {
    throw error;
  }
};

const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      createdEvents: events.bind(this, user.createdEvents),
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  events: async () => {
    try {
      const events = await Event.find();
      return events.map((event) => {
        return {
          ...event._doc,
          date: new Date(event.date).toISOString(),
          creator: user.bind(this, event.creator),
        };
      });
    } catch (error) {
      throw error;
    }
  },
  createEvent: async (args) => {
    const { title, description, price, date } = args.eventInput;
    const event = new Event({
      title,
      description,
      price: +price,
      date,
      creator: "633d334e26a1bfc9b1b245de",
    });
    let createdEvent;
    try {
      const result = await event.save();
      createdEvent = {
        ...result._doc,
        date: new Date(result.date).toISOString(),
        creator: user.bind(this, result.creator),
      };

      const creator = await User.findById("633d334e26a1bfc9b1b245de");
      if (!creator) {
        throw new Error("User not found!");
      }
      creator.createdEvents.push(event);
      await creator.save();

      return createdEvent;
    } catch (error) {
      throw error;
    }
  },
  createUser: async (args) => {
    try {
      const { email, password } = args.userInput;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("User exists already!");
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        email,
        password: hashedPassword,
      });

      const result = await user.save();

      return { ...result._doc, password: null };
    } catch (error) {
      throw error;
    }
  },
};
