const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Định nghĩa schema cho model User
const userSchema = new Schema({
    name: String,
    mail: String,
    pass: String,
    urlImage: String
});

// Phương thức tạo đối tượng User từ req.body
userSchema.statics.createFromRequestBody = function(body) {
    return new this({
        name: body.name,
        phone: body.phone,
        mail: body.mail,
        pass: body.pass,
        urlImage: body.urlImage
    });
};

// Tạo model User từ schema và export nó
const User = mongoose.model('users', userSchema);
module.exports = User;
