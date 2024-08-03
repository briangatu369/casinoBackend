const BetHistory = require("../../../models/BetHistory");
const User = require("../../../models/User.model");
const CustomError = require("../../../utils/customErrors");

const calulateMultiplier = (tilesOpened, bombs, totalTiles) => {
  let probability = 1;

  for (let i = 0; i < tilesOpened; i++) {
    const safeTilesRemaining = totalTiles - bombs - i;
    const totalTileRemaining = totalTiles - i;
    const tileProbalility = safeTilesRemaining / totalTileRemaining;

    probability *= tileProbalility;
  }
  console.log(probability);
  const multiplier = 1 / probability;

  return multiplier;
};

const placeBet = async (req, res) => {
  const { gameId, index } = req.body;

  const minesGame = await BetHistory.findById(gameId); //must be there

  if (!minesGame) {
    throw new CustomError(
      400,
      "mines game not found your bet amount will be refunded"
    );
  }

  let {
    gameResults,
    stake,
    bombs,
    multiplier,
    payout,
    hasMined,
    tilesOpened,
    AccountBalance,
  } = minesGame.betDetails;
  const userId = minesGame.userId;

  const hasCorrectPick = gameResults[index] === 1 ? true : false;

  // busted
  if (!hasCorrectPick) {
    AccountBalance -= stake;
    await User.findByIdAndUpdate(userId, { AccountBalance }, { new: true });

    const newBetDetails = await BetHistory.findByIdAndUpdate(
      gameId,
      {
        "betDetails.hasMined": true,
        "betDetails.isBusted": true,
        "betDetails.hasCashedout": false,
      },
      { new: true }
    );

    return res.status(200).json(newBetDetails);
  }

  //update game data
  tilesOpened += 1;
  multiplier = calulateMultiplier(tilesOpened, bombs, 25);
  multiplier.toFixed(2);
  payout = multiplier * stake;

  const newBetDetails = await BetHistory.findByIdAndUpdate(
    gameId,
    {
      "betDetails.multiplier": multiplier,
      "betDetails.payout": payout,
      "betDetails.tilesOpened": tilesOpened,
    },
    { new: true }
  );

  const newGameResult = new Array(25).fill(0);

  return res.status(200).json(newBetDetails);
};

module.exports = { placeBet };

console.log(calulateMultiplier(1, 5, 25));
