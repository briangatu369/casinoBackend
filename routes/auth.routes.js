const express = require("express");
const { tryCatch } = require("../utils/tryCatch");
const signup = require("../controllers/auth/signup.controllers");
const { signin } = require("../controllers/auth/signin.controllers");
const { validateJwt } = require("../middleware/validateTokens");
const {
  validateAuth,
} = require("../controllers/auth/validateAuth.controllers");

const router = express.Router();

router.post("/signup", tryCatch(signup));
router.post("/signin", tryCatch(signin));
router.get("/validatetoken", tryCatch(validateJwt), tryCatch(validateAuth));

module.exports = { AuthRouter: router };
