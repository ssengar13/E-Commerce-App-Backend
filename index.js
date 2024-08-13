const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 5000;
const authRouter = require("./routes/authRoute");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

dbConnect();

app.use("/api/user", authRouter);
app.listen(PORT, () =>{
    console.log(`server is running at PORT ${PORT}`);
});
