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
    indexOpened,
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
        $push: { "betDetails.indexOpened": index },
      },
      { new: true }
    );

    return res.status(200).json(newBetDetails);
  }

  //repeated index
  for (i = 0; i < indexOpened?.length; i++) {
    if (indexOpened[i] === index) {
      throw new CustomError(400, "tile already choosen:pick a new tile");
    }
  }

  // completed the grid
  const maxTilesToOpen = 25 - bombs;
  if (tilesOpened + 1 >= maxTilesToOpen) {
    // cashout logic
    multiplier = calulateMultiplier(tilesOpened, bombs, 25);
    const formattedMultiplier = Number(multiplier.toFixed(2));
    payout = Number((multiplier * stake).toFixed(2));

    const newBetDetails = await BetHistory.findByIdAndUpdate(
      gameId,
      {
        "betDetails.multiplier": formattedMultiplier,
        "betDetails.payout": payout,
        "betDetails.hasMined": true,
        "betDetails.hasCashedout": true,
        "betDetails.tilesOpened": tilesOpened + 1,
        $push: { "betDetails.indexOpened": index },
      },
      { new: true }
    );
    console.log(newBetDetails);
    return res.status(200).json(newBetDetails);
  }

  //game is on going
  tilesOpened += 1;
  multiplier = calulateMultiplier(tilesOpened, bombs, 25);
  const formattedMultiplier = Number(multiplier.toFixed(2));
  payout = Number((multiplier * stake).toFixed(2));

  const newBetDetails = await BetHistory.findByIdAndUpdate(
    gameId,
    {
      "betDetails.multiplier": formattedMultiplier,
      "betDetails.payout": payout,
      "betDetails.tilesOpened": tilesOpened,
      $push: { "betDetails.indexOpened": index },
    },
    { new: true }
  );

  const newGameResult = new Array(25).fill(0);
  const indicesOpened = newBetDetails.betDetails.indexOpened;
  indicesOpened.forEach((index) => {
    newGameResult[index] = 1;
  });
  newBetDetails.betDetails.gameResults = newGameResult;

  return res.status(200).json(newBetDetails);
};

module.exports = { placeBet };
