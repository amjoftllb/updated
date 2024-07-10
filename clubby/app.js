const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


app.get("/", (req, res) => {
    res.send("<h1>HI-Here Backend API is working!</h1>");
  });

//import routers
const userRoutes = require("./src/routes/user.routes.js");
const adminRoutes = require("./src/routes/admin.routes.js");

// routes declaration
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);


module.exports = app;
