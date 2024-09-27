const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Định nghĩa schema cho model Task
const taskSchema = new Schema({
    content: { type: String, required: true, trim: true },
    date: { type: Date, required: true, trim: true },
    time: { type: String, required: true, trim: true },
    location: { type: Boolean, required: true, trim: true },
    host: [{ type: String, required: true, trim: true }], // Thay đổi thành Array
    note: { type: String, trim: true },
    status: { type: String, trim: true}, // Trạng thái công việc
    approver: { type: String, trim: true } // Người thực hiện kiểm duyệt
});

// Phương thức tạo đối tượng Task từ req.body
taskSchema.statics.createFromRequestBody = function(body) {
    return new this({
        content: body.content,
        date: new Date(body.date),  // Lưu phần ngày từ req.body
        time: body.time,
        location: body.location,
        host: body.host,
        note: body.note,
        status: body.status,
        approver: body.approver,
    });
};

// Tạo model Task từ schema và export nó
const Task = mongoose.model('tasks', taskSchema);
module.exports = Task;
