const mongoose = require('mongoose');

const equipoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  logo_url: { type: String, required: true },  // URL del logo del equipo
  puntos: { type: Number, default: 0 }  // Puntos acumulados en la liga
});


// Middleware para eliminar partidos relacionados en cascada
equipoSchema.pre('findOneAndDelete', async function (next) {
  const equipoId = this.getQuery()._id;

  // Elimina todos los partidos donde el equipo es local o visitante
  await mongoose.model('Partidos').deleteMany({
      $or: [
          { equipo_local: equipoId },
          { equipo_visitante: equipoId }
      ]
  });

  next();
});

const Equipo = mongoose.model('Equipos', equipoSchema);


module.exports = Equipo;
