const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: [true, "username is taken"],
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: { type: String, required: true },
    AccountBalance: { type: Number, default: 100000 },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
