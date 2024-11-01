const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nome: String,
    email: { type: String, unique: true },
    senha: String,
    cidade: String,
    tipo: String, // consumidor ou prestador de serviço
    isAdmin: { type: Boolean, default: false } // Identifica o administrador
});

module.exports = mongoose.model('User', userSchema);
