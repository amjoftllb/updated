const express = require("express");
const cors = require("cors");

const app = express()

app.use(cors({
    origin: "*",
    credentials : true
}))
app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended: true , limit : "16kb"}))
app.use(express.static("public"))

// Routes
const chatRoutes = require('./src/routes/chatRoutes.js');
app.use('/api/chat', chatRoutes);


module.exports = app;




