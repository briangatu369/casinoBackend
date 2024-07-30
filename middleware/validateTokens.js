const CustomError = require("../utils/customErrors");
const jwt = require("jsonwebtoken");

const validateJwt = (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    throw new CustomError(401, "token was not found");
  }

  const secretkey = process.env.JWTSECRET;
  const decodeJwt = jwt.verify(token, secretkey);

  req.user = decodeJwt;

  next();
};

module.exports = { validateJwt };
