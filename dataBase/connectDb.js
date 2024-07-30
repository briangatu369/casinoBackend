const mongoose = require("mongoose");

const connectDatabase = async (url) => {
  try {
    await mongoose.connect(url);
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { connectDatabase };
