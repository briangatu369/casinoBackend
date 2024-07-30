const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { AuthRouter } = require("./routes/auth.routes");
const { connectDatabase } = require("./dataBase/connectDb");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();
dotenv.config(); // load .env variables

const MONGOURL = process.env.MONGOURL;
const PORT = process.env.PORT;
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", AuthRouter);
app.use(errorHandler);

const startServer = async () => {
  await connectDatabase(MONGOURL);

  app.listen(PORT, () => {
    console.log("The server is running on port", PORT);
  });
};

startServer();
