const bcrypt = require("bcrypt");

const saltRounds = 10;

const hashPassword = (password) => {
  const hashedPassword = bcrypt.hashSync(password, saltRounds);
  return hashedPassword;
};

module.exports = hashPassword;
