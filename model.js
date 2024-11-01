const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
    nome: String,
    data: Date,
    horario: String,
    modelo: String,
});

const Reserva = mongoose.model('Reserva', reservaSchema);
module.exports = Reserva;
