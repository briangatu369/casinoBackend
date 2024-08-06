const express = require("express");
const { startGame } = require("../controllers/casino/mines/StartGame");
const { tryCatch } = require("../utils/tryCatch");
const { placeBet } = require("../controllers/casino/mines/placeBet");
const { cashout } = require("../controllers/casino/mines/cashout");
const router = express.Router();

router.post("/mines/startgame", tryCatch(startGame));
router.post("/mines/placebet", tryCatch(placeBet));
router.post("/mines/cashout", tryCatch(cashout));

module.exports = { CasinoRouter: router };
