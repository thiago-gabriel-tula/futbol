const Partidos = require('../models/Partidos.js');
const Equipo = require('../models/Equipos.js');

const partidosInicio = async (req, res, next)=>{
    const fechaCompleta = new Date();
    const fecha = fechaCompleta.toISOString().split('T')[0];

    try{
        const partidos = await Partidos.find({fecha: {$gt: fecha}}).limit(3).populate('equipo_local').populate('equipo_visitante');

        res.json(partidos);

    } catch (error){
        console.log(error);
        res.json({msg: 'Error al ver los partidos de hoy'})
        next()
    }
}

const verPartidosHoy = async (req, res, next)=>{
    const fechaCompleta = new Date();
    const fecha = fechaCompleta.toISOString().split('T')[0];
    
    try{
        const partidos = await Partidos.find({fecha}).populate('equipo_local').populate('equipo_visitante');

        res.json(partidos);

    } catch (error){
        console.log(error);
        res.json({msg: 'Error al ver los partidos de hoy'})
        next()
    }
}

const verPartidosProximos = async (req, res, next)=>{
    const fechaCompleta = new Date();
    const fecha = fechaCompleta.toISOString().split('T')[0];
    
    try{
        const partidos = await Partidos.find({fecha: {$gt: fecha}}).populate('equipo_local').populate('equipo_visitante');

        res.json(partidos);

    } catch (error){
        console.log(error);
        res.json({msg: 'Error al ver los partidos proximos'})
        next()
    }
}

const verPartidosAnteriores = async (req, res)=>{
    const fechaCompleta = new Date();
    const fecha = fechaCompleta.toISOString().split('T')[0];
    
    try{
        const partidos = await Partidos.find({fecha: {$lt: fecha}}).populate('equipo_local').populate('equipo_visitante').sort({fecha: -1}).limit(14);

        res.json(partidos);

    } catch (error){
        console.log(error);
        res.json({msg: 'Error al ver los partidos anteriores'})
        next()
    }
}

const buscarPartido = async (req, res, next)=>{
    const {id} = req.params;

    try{
        const partido = await Partidos.findById(id).populate('equipo_local').populate('equipo_visitante');

        if(!partido){
            return res.json({msg: 'No existe tal partido'});
        }

        res.json(partido)
    } catch(error){
        console.log(error)
        res.json(error)
        next()
    }
}

const nuevoPartido = async (req, res, next)=>{
    const {fecha, equipo_local, equipo_visitante, hora } = req.body;

    try{
        
        const fechaPartido = new Date(fecha);
        const hoy = new Date();

        // Si el partido es en el futuro, se deja `resultado` como `null`
        const resultado = fechaPartido > hoy ? {
            goles_local: 0,
            goles_visitante: 0
        } : {
            goles_local: req.body.resultado.goles_local,
            goles_visitante: req.body.resultado.goles_visitante
        };

        

        if(resultado !== null){
            const [ equipoLocal, equipoVisitante ] = await Promise.all([
                Equipo.findById(equipo_local),
                Equipo.findById(equipo_visitante)
            ])

            console.log('Puntos antes: ', equipoLocal.puntos, equipoVisitante.puntos)

            if(req.body.resultado.goles_local > req.body.resultado.goles_visitante){
                equipoLocal.puntos += 3;
                equipoVisitante.puntos += 0;
            }else if(req.body.resultado.goles_local < req.body.resultado.goles_visitante){
                equipoLocal.puntos += 0;
                equipoVisitante.puntos += 3;
            }else{
                equipoLocal.puntos += 1;
                equipoVisitante.puntos += 1;
            }

            // Guardar los cambios en los equipos
            await equipoLocal.save();
            await equipoVisitante.save();

            console.log('Puntos despues: ', equipoLocal.puntos, equipoVisitante.puntos)
        }
        
        const nuevoPartido = new Partidos({
            fecha,
            equipo_local,
            equipo_visitante,
            hora,
            resultado
        })
        const partidoGuardado = await nuevoPartido.save();

        res.status(201).json(partidoGuardado)

    } catch (error){
        console.log(error);
        res.json({msg: 'Error al subir el partido'})
        next()
    }
}


const editarPartido = async (req, res, next)=>{
    const {id} = req.params;
    const {resultado} = req.body;
    const nuevosDatos = req.body;


    try{
        // Obtener el partido existente antes de actualizar
        const partidoAnterior = await Partidos.findById(id).populate('equipo_local equipo_visitante');

        if (!partidoAnterior) {
            return res.status(404).json({ msg: 'No existe ese partido' });
        }

        // Obtener los equipos
        const [equipoLocal, equipoVisitante] = await Promise.all([
            Equipo.findById(partidoAnterior.equipo_local._id),
            Equipo.findById(partidoAnterior.equipo_visitante._id)
        ])

        // Guardar los resultados anteriores
        const { goles_local: golesLocalAnterior, goles_visitante: golesVisitanteAnterior } = partidoAnterior.resultado;

        // verifica si cambió el equipo local
        if(equipoLocal._id !== nuevosDatos.equipo_local){
            // ganó?
            if(golesLocalAnterior > golesVisitanteAnterior){
                equipoLocal.puntos -= 3; 
            }

            // empató?
            if(golesLocalAnterior == golesVisitanteAnterior){
                equipoLocal.puntos -= 1; 
            }
        }

        // verifica si cambió el equipo visitante
        if(equipoVisitante._id !== nuevosDatos.equipo_visitante){
            // ganó?
            if(golesLocalAnterior < golesVisitanteAnterior){
                equipoVisitante.puntos -=3;
            }

            // emaptó?
            if(golesLocalAnterior == golesVisitanteAnterior){
                equipoVisitante.puntos -=1;
            }
        }

        // buscar los nuevos equipos si son diferentes
        const [nuevoEquipoLocal, nuevoEquipoVisitante ] = await Promise.all([
            Equipo.findById(nuevosDatos.equipo_local),
            Equipo.findById(nuevosDatos.equipo_visitante)
        ])


        // Restablecer puntos del equipo local si es el mismo equipo
        if (nuevoEquipoLocal._id.equals(equipoLocal._id)) {
            if (golesLocalAnterior > golesVisitanteAnterior) {
                nuevoEquipoLocal.puntos -= 3; // Ganó antes
            } else if (golesLocalAnterior == golesVisitanteAnterior) {
                nuevoEquipoLocal.puntos -= 1; // empató antes
            }
        }

        // Restablecer puntos del equipo visitante si es el mismo equipo
        if (nuevoEquipoVisitante._id.equals(equipoVisitante._id)) {
            if (golesLocalAnterior < golesVisitanteAnterior) {
                nuevoEquipoVisitante.puntos -= 3; // Ganó antes
            } else if (golesLocalAnterior == golesVisitanteAnterior) {
                nuevoEquipoVisitante.puntos -= 1; // empató antes
            }
        }

        // Aplicar los nuevos puntos según el nuevo resultado
        const { goles_local: golesLocalNuevo, goles_visitante: golesVisitanteNuevo } = resultado;

        if (golesLocalNuevo > golesVisitanteNuevo) {
            // Nuevo ganador: equipo local
            nuevoEquipoLocal.puntos += 3;
            nuevoEquipoVisitante.puntos += 0;
        } else if (golesLocalNuevo < golesVisitanteNuevo) {
            // Nuevo ganador: equipo visitante
            nuevoEquipoVisitante.puntos += 3;
            nuevoEquipoLocal.puntos += 0;
        } else {
            // Nuevo resultado es empate
            nuevoEquipoLocal.puntos += 1;
            nuevoEquipoVisitante.puntos += 1;
        }

        // Guardar los cambios en los equipos
        await equipoLocal.save();
        await equipoVisitante.save();
        await nuevoEquipoLocal.save();
        await nuevoEquipoVisitante.save();

        const partidoActualizado = await Partidos.findByIdAndUpdate(
            id,
            nuevosDatos,
            { new: true, runValidators: true }
        )
        res.status(200).json({msg: 'Partido actualizado'});
    }catch(error){
        console.log(error);
        res.json(error);
        next()
    }
}


const eliminarPartido = async (req, res, next)=>{
    const {id} = req.params;

    try {
        // encontrar Partido
        const partido = await Partidos.findById(id);

        if(!partido){
            return res.status(404).json({msg: 'no existe el partido solicitado'})
        }

        // buscar a los equipos
        const [equipoLocal, equipoVisitante] = await Promise.all([
            Equipo.findById(partido.equipo_local._id),
            Equipo.findById(partido.equipo_visitante._id),
        ])

        // eliminar los puntos de los equipos segun el resultado
        if(partido.resultado.goles_local > partido.resultado.goles_visitante){
            equipoLocal.puntos -= 3;
        }else if(partido.resultado.goles_local < partido.resultado.goles_visitante){
            equipoVisitante.puntos -= 3;
        }else{
            equipoLocal.puntos -= 1;
            equipoVisitante.puntos -= 1;
        }


        // eliminar el partido
        await Partidos.findByIdAndDelete(id);
        await equipoLocal.save();
        await equipoVisitante.save();

        res.json({msg: 'Partido eliminado'})
    } catch (error) {
        console.log(error)
        res.status(500).json({msg: error})
    }
}

const partidoUnico = async (req, res, next)=>{
    const {id} = req.params;

    try{
        // consultar a la api por el id
        const partidos = await Partidos.find({$or: [{ equipo_local: id }, { equipo_visitante: id } ]}).populate('equipo_local').populate('equipo_visitante').sort({ fecha: -1 }) // Ordena por fecha de forma descendente
        res.status(200).json(partidos)
    }catch (error){
        console.log(error)
    }

}

module.exports = {
    partidosInicio,
    nuevoPartido,
    verPartidosProximos,
    verPartidosHoy,
    verPartidosAnteriores,
    buscarPartido,
    editarPartido,
    eliminarPartido,
    partidoUnico
}