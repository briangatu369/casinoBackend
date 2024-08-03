const mongoose = require("mongoose");

const minesSchema = new mongoose.Schema(
  {
    stake: { type: Number, required: true },
    bombs: { type: Number, required: true },
    multiplier: { type: Number, required: true },
    payout: { type: Number, required: true },
    hasMined: { type: Boolean, default: false, required: true },
    gameResults: { type: [Number], required: true },
  },
  { timestamps: true }
);

module.exports = { minesSchema };
