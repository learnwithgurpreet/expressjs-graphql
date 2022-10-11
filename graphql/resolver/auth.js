const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotEnv = require("dotenv");
dotEnv.config();

const User = require("../../models/user");

module.exports = {
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
  login: async ({ email, password }) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Invalid credentials!");
      }
      const isEqual = await bcrypt.compare(password, user.password);
      if (!isEqual) {
        throw new Error("Invalid credentials!");
      }

      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
        },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );

      return {
        userId: user.id,
        token,
        tokenExpiration: 1,
      };
    } catch (error) {
      throw error;
    }
  },
};
