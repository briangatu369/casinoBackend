const BetHistory = require("../../../models/BetHistory");
const User = require("../../../models/User.model");
const CustomError = require("../../../utils/customErrors");

const cashout = async (req, res) => {
  const { gameId } = req.body;
  let { _id, email } = req.user;

  if (!gameId) {
    throw new CustomError(400, "Game id was not found");
  }

  const betInfo = await BetHistory.findByIdAndUpdate(
    gameId,
    {
      "betDetails.hasMined": true,
      "betDetails.isBusted": false,
      "betDetails.hasCashedout": true,
    },
    { new: true }
  );
  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError(401, "user was not found");
  }

  const stake = betInfo?.betDetails?.stake;
  const { AccountBalance } = user;
  const newAccountBalance = AccountBalance + stake;

  await User.findByIdAndUpdate(
    _id,
    { AccountBalance: newAccountBalance },
    { new: true }
  );

  res.status(200).json({ betInfo, newAccountBalance });
};

module.exports = { cashout };
