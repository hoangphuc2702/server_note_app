const express = require("express");
const Task = require("../models/task");

const app = express();

// Endpoint to get all tasks
app.get("/getTasks", async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.json(tasks);
    } catch (err) {
        res.status(400).json({ err: 'ERROR' });
    }
});

// Endpoint to search task
app.get("/searchTaskbyname/:name", async (req, res) => {
    try {
        const name = req.params.name;
        const tasks = await Task.find({ name: { $regex: name, $options: 'i' } }); // Tìm kiếm không phân biệt hoa thường
        res.json(tasks);
    } catch (err) {
        res.status(400).json({ err: 'ERROR' });
    }
});

// Endpoint to search task by exact date
app.get("/searchTaskbydate/:date", async (req, res) => {
    try {
        const dateStr = req.params.date; // Ngày dưới dạng chuỗi
        const date = new Date(dateStr); // Chuyển đổi chuỗi thành đối tượng Date

        // Kiểm tra xem ngày có hợp lệ hay không
        if (isNaN(date.getTime())) {
            return res.status(400).json({ error: 'Invalid date format' });
        }

        // Tạo một ngày không có giờ phút giây để so sánh chính xác
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        // Tìm kiếm công việc trong khoảng thời gian (ngày cụ thể)
        const tasks = await Task.find({
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        // Nếu tìm thấy công việc
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: 'ERROR' });
    }
});

// Endpoint to insert a new task
app.post("/insertTask", async (req, res) => {
    try {
        const { content, date, time, location, host, note, status, approver } = req.body;
        console.log(content + ":" + date + ":" + time + location + ":" + host);

        // Sử dụng phương thức createFromRequestBody để tạo Task mới
        const newTask = Task.createFromRequestBody(req.body);

        await newTask.save();
        res.status(201).json({ message: "Task created successfully" });
    } catch (error) {
        console.error("Error inserting task:", error);
        res.status(500).json({ error: "Failed to insert task" });
    }
});

// Endpoint to delete a task
app.delete("/deleteTask/:id", async (req, res) => {
    try {
        const taskId = req.params.id;
        await Task.findByIdAndDelete(taskId);
        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete task" });
    }
});

// Endpoint to update a task
app.put("/updateTask/:id", async (req, res) => {
    try {
        const taskId = req.params.id;
        const { content, time, location, host, note, status, approver } = req.body;
        
        // Cập nhật các trường tùy chọn, kiểm tra nếu không null mới cập nhật
        const updateFields = {};
        if (content) updateFields.content = content;
        if (time) updateFields.time = time;
        if (location !== undefined) updateFields.location = location; // Boolean có thể là false
        if (host) updateFields.host = host;
        if (note) updateFields.note = note;
        if (status) updateFields.status = status;
        if (approver) updateFields.approver = approver;

        await Task.findByIdAndUpdate(taskId, updateFields);
        res.json({ message: "Task updated successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to update task" });
    }
});

// Endpoint to toggle the isStarred status of a task
app.put("/updateStarredTask/:id", async (req, res) => {
    try {
        const taskId = req.params.id;

        // Tìm task theo ID
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }

        // Đảo ngược giá trị isStarred
        task.isStarred = !task.isStarred;

        // Lưu lại công việc đã cập nhật
        await task.save();

        res.json({ message: "Task updated successfully", isStarred: task.isStarred });
    } catch (err) {
        res.status(500).json({ error: "Failed to update task" });
    }
});

module.exports = app;
