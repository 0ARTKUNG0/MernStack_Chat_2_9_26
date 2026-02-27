const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const userRouter = require("./router/user.router");
const messageRouter = require("./router/message.router");
const {app, server} = require("./lib/socket");

dotenv.config();

const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;

app.use(express.json({ limit: "500mb" }));

const allowedOrigins = [process.env.BASE_URL];

app.use(cors({
    origin: process.env.BASE_URL,
    credentials: true
}));

app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/api/v1/auth", userRouter);
app.use("/api/v1/messages", messageRouter);

if(!MONGODB_URL){
    console.error("MongoDB URL is missing. Please set it in your .env file.");
    process.exit(1);
}else{
    mongoose.connect(MONGODB_URL)
    .then(() => {
        console.log("Connected to MongoDB successfully");
    })
    .catch((err) => {
        console.error("MongoDB connection error", err.message);
    });
}

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
