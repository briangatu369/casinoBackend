const CustomError = require("../utils/customErrors");

const errorHandler = (error, req, res, next) => {
  if (error instanceof CustomError) {
    return res
      .status(error.status)
      .json({ status: error.status, message: error.message });
  }

  res.status(500).json(error);
};

module.exports = { errorHandler };
