const express = require('express');

const equiposController = require('../controllers/equiposControllers.js');
const partidosController = require('../controllers/partidosControllers.js')
const upload = require( '../middleware/multer.js');
const router = express.Router();


// ============================= EQUIPOS ====================================
router.get('/equipos', equiposController.verEquipos);
router.get('/equipos/:id', equiposController.verUnSoloEquipo)
router.post('/equipos', equiposController.subirNuevoEquipo);
router.put('/equipo-actualizar/:id', equiposController.editarEquipo);
router.delete('/equipos-eliminar/:id', equiposController.eliminarEquipo);
// router.post('/equipos-buscar/:id', equiposController.buscarEquipo);


//============================= PARTIDOS =========================================
router.get('/partidos/inicio', partidosController.partidosInicio)
router.get('/partidos/proximos', partidosController.verPartidosProximos);
router.get('/partidos/anteriores', partidosController.verPartidosAnteriores);
router.get('/partidos/hoy', partidosController.verPartidosHoy);
router.post('/partidos-nuevo', partidosController.nuevoPartido);
router.put('/partido-editar/:id', partidosController.editarPartido);
router.delete('/partido-eliminar/:id', partidosController.eliminarPartido);
router.get('/partido/:id', partidosController.buscarPartido);
router.get('/partidos-unico/:id', partidosController.partidoUnico)

module.exports =  router;