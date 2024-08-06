const CustomError = require("../utils/customErrors");

const errorHandler = (error, req, res, next) => {
  if (error.name === "JsonWebTokenError") {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "session has expired" });
    }
    return res.status(401).json({ message: "invalid token" });
  }

  if (error instanceof CustomError) {
    return res
      .status(error.status)
      .json({ status: error.status, message: error.message });
  }

  console.log(error);

  res.status(500).json(error);
};

module.exports = { errorHandler };
