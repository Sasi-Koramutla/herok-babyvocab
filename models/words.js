const mongoose = require('mongoose');

const wordSchema = new mongoose.Schema({
    babyName: { type: String},
    word: { type: String, required: true },
    user: { type: String , required: true},
    tags: { type: String},
},{timestamps: true});

const Word = mongoose.model('Word', wordSchema);

module.exports = Word;