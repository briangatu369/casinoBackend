const jwt = require("jsonwebtoken");

const generateJwt = (payload, secretkey, others) => {
  const jsonwebtoken = jwt.sign(payload, secretkey, others);
  return jsonwebtoken;
};

module.exports = { generateJwt };
