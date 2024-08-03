const express = require("express");
const { startGame } = require("../controllers/casino/mines/StartGame");
const { tryCatch } = require("../utils/tryCatch");
const router = express.Router();

router.post("/mines/startgame", tryCatch(startGame));

module.exports = { CasinoRouter: router };
