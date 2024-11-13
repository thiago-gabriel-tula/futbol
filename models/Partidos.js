const mongoose = require('mongoose');
const Equipo = require('./Equipos');

const partidoSchema = new mongoose.Schema({
    fecha: {
        type: Date,
        required: true
    },
    equipo_local: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Equipos', 
        required: true 
    },
    equipo_visitante: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Equipos', 
        required: true 
    },
    hora: {
        type: String
    },
    resultado: {
        goles_local: {
            type: Number,
            default: 0
        },
        goles_visitante: {
            type: Number,
            default: 0
        }
    }
});

const Partidos = mongoose.model('Partidos', partidoSchema);

module.exports = Partidos;
