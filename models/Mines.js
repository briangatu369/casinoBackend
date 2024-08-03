const mongoose = require("mongoose");

const minesSchema = new mongoose.Schema(
  {
    stake: { type: Number, required: true },
    bombs: { type: Number, required: true },
    multiplier: { type: Number, required: true },
    payout: { type: Number, required: true },
    AccountBalance: { type: Number, required: true },
    hasMined: { type: Boolean, default: false, required: true },
    isBusted: { type: Boolean, default: false, required: true },
    hasCashedout: { type: Boolean, default: false, required: true },
    tilesOpened: { type: Number, default: 0, required: true },
    indexOpened: { type: [Number] },
    gameResults: { type: [Number], required: true },
  },
  { timestamps: true }
);

module.exports = { minesSchema };
