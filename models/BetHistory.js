const mongoose = require("mongoose");
const { minesSchema } = require("./Mines");

const BetHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  gameType: { type: String, required: true, enum: ["mines", "crash", "rps"] },
  betDetails: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

const BetHistory = mongoose.model("betHistory", BetHistorySchema);

module.exports = BetHistory;
