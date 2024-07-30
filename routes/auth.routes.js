const express = require("express");
const { tryCatch } = require("../utils/tryCatch");
const signup = require("../controllers/auth/signup.controllers");
const { signin } = require("../controllers/auth/signin.controllers");

const router = express.Router();

router.post("/signup", tryCatch(signup));
router.post("/signin", tryCatch(signin));

module.exports = { router: AuthRouter };
