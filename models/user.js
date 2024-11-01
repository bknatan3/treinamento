const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nome: String,
    email: String,
    cidade: String,
    senha: String
});

module.exports = mongoose.model('User', userSchema);
