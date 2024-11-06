const mongoose = require('mongoose');

// Define o esquema do usuário
const usuarioSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    senha: {
        type: String,
        required: true
    },
    tipoUsuario: {
        type: String,
        enum: ['cliente', 'fornecedor'],
        required: true
    },
    bio: {
        type: String,
        default: '' // Adiciona bio com valor padrão como string vazia
    },
    fotos: {
        type: [String], // Array para URLs de fotos
        default: []
    },
    videos: {
        type: [String], // Array para URLs de vídeos
        default: []
    }
    // Outros campos que você já possui no modelo de usuário
});

// Cria e exporta o modelo com o esquema atualizado
const Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;
