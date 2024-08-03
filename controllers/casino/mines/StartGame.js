const BetHistory = require("../../../models/BetHistory");
const { MinesGame } = require("../../../models/Mines");
const User = require("../../../models/User.model");
const CustomError = require("../../../utils/customErrors");

let gridSize = 25;

const generateRamdomNumber = (size) => {
  const randomNumber = Math.floor(Math.random() * size);
  return randomNumber;
};

const generateGameOutcome = (bombs) => {
  const gameOutcome = new Array(gridSize).fill(1);
  const zeroIndices = new Set();

  while (zeroIndices.size < bombs) {
    const randomNumber = generateRamdomNumber(gridSize);
    zeroIndices.add(randomNumber);
  }

  zeroIndices.forEach((index) => {
    gameOutcome[index] = 0;
  });

  return gameOutcome;
};

const startGame = async (req, res) => {
  const { bombs, stake } = req.body;
  let { username, _id } = req.user;

  if (!stake || !bombs) {
    throw new CustomError(400, "stake or bombs not provided");
  }

  const user = await User.findOne({ username });
  const { AccountBalance } = user;

  if (Number(stake) > AccountBalance) {
    throw new CustomError(400, `no enough balance,Balance: ${AccountBalance}`);
  }

  //gameOutcome
  const gameOutcome = generateGameOutcome(bombs);

  const newGame = new MinesGame({
    stake,
    bombs,
    multiplier: 1,
    payout: 0,
    hasMined: false,
    AccountBalance,
    tilesOpened: 0,
    gameResults: gameOutcome,
  });

  const newMinesBet = new BetHistory({
    userId: _id,
    gameType: "mines",
    betDetails: newGame,
  });

  await newMinesBet.save();

  const { betDetails, ...minesData } = newMinesBet._doc;
  betDetails.gameResults = new Array(gridSize).fill(0);
  const minesDataToSend = { ...minesData, betDetails };

  res.status(200).json(minesDataToSend);
};

module.exports = { startGame };
