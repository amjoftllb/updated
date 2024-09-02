const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(cors({origin: "*",credentials: true,}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


const userRoutes = require("./src/routes/user.routes.js");


app.use("/api/user", userRoutes);

module.exports = app;