const express = require("express");
const mongoose = require("mongoose");
const userController = require("./controllers/userController");
const taskController = require("./controllers/taskController");

const link = "mongodb+srv://tonthathoangphuc270203:22F9ghpERKKSB0Rs@cluster0.umfaw.mongodb.net/notedb";


const app = express();

mongoose.connect(link)
    .then(() => {
        console.log("successfully connect");
    })
    .catch((err) => {
        console.log(err);
    });

// Middleware for parsing JSON data from requests
app.use(express.json());

// app.get('/', (req, res) => res.json({ answer: 42 }));
app.get('/', (req, res) =>{
    res.send("Hello world!")
});

// user controller
app.use("/user", userController);

// task controller
app.use("/task", taskController);
// task/getTasks

app.listen(3000, () => {
    console.log("Server is running port http://localhost:3000");
});