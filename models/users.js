const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    username: {type: String, required: true, uniqe: true},
    babyName: {type: String, required: true},
    img: { type: String}
},{timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;