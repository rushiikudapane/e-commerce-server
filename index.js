//db password: LRrLE1jWVl3GandH

const { json } = require("body-parser");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

dotenv.config({ path: "./config.env" });
require("./db/connection");
const User = require("./model/userSchema");

//to link all router apis
const auth = require("./router/auth");

const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use("/", auth);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT} !!!!`);
});
