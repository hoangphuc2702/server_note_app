const express = require("express");
const User = require("../models/user");

const app = express();

// Endpoint to get all users
app.get("/getUsers", async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (err) {
        res.status(400).json({ err: 'ERROR' });
    }
});

// Endpoint to insert a new user
app.post("/insertUser", async (req, res) => {
    try {
        const { name, mail, pass, urlImage } = req.body;
        console.log(name + ":" + mail + ":" + pass + ":" + urlImage);
        
        // Sử dụng phương thức createFromRequestBody để tạo User mới
        const newUser = User.createFromRequestBody(req.body);

        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Error inserting user:", error);
        res.status(500).json({ error: "Failed to insert user" });
    }
});

// Endpoint to delete a user
app.delete("/deleteUser/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        await User.findByIdAndDelete(userId);
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete user" });
    }
});

// Endpoint to update a user
app.put("/updateUser/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const { name, urlImage } = req.body;
        
        // Kiểm tra và cập nhật các trường
        const updateFields = {};
        if (name) updateFields.name = name;
        if (urlImage) updateFields.urlImage = urlImage;

        await User.findByIdAndUpdate(userId, updateFields);
        res.json({ message: "User updated successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to update user" });
    }
});

module.exports = app;
