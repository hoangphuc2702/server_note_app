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

// Endpoint to search user
app.get("/searchUser/:name", async (req, res) => {
    try {
        const name = req.params.name;
        const users = await User.find({ name: { $regex: name, $options: 'i' } }); // Tìm kiếm không phân biệt hoa thường
        res.json(users);
    } catch (err) {
        res.status(400).json({ err: 'ERROR' });
    }
});

// Endpoint to login a user
app.post("/login", async (req, res) => {
    try {
        const { mail, pass } = req.body;

        // Tìm người dùng theo mail
        const user = await User.findOne({ mail });
        if (!user || user.pass !== pass) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Trả về thông tin người dùng nếu đăng nhập thành công
        res.json({ message: "Login successful", user });
    } catch (err) {
        res.status(500).json({ error: "Failed to login" });
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
