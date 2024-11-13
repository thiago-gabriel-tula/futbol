const mongoose = require('mongoose');
const Partidos = require('./Partidos.js');

const ligaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    temporada: {
        type: Number,
        required: true
    },
    partidos: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'Partidos'
        }
    ]
})

const Liga = mongoose.model('Liga', ligaSchema);

module.exports = Liga