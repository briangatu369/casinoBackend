const express = require("express");
const dotenv = require("dotenv");
const { connectDatabase } = require("./dataBase/connectDb");

const app = express();
dotenv.config(); // load .env variables

const MONGOURL = process.env.MONGOURL;
const PORT = process.env.PORT;

const startServer = async () => {
  await connectDatabase(MONGOURL);

  app.listen(PORT, () => {
    console.log("The server is running on port", PORT);
  });
};

startServer();
