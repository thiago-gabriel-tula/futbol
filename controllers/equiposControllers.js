const Equipo = require("../models/Equipos.js");
const mongoose = require('mongoose')


const verUnSoloEquipo = async (req, res, next)=>{
    const {id} = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
       
        return res.json({msg: 'Equino no encontrado'});; // O maneja el error como prefieras
    }

    try{
        const equipo = await Equipo.findById(id);

        if (!equipo) {
            return res.json({msg: 'Equino no encontrado'});
        }

        res.json(equipo); 

    }catch(error){
        console.log(error);
        next();
    }
}

const verEquipos = async (req, res, nex)=>{

    try {
        const equipos = await Equipo.find({});
        
        res.json(equipos);
    } catch (error) {
        console.log(error);
    }
}



const subirNuevoEquipo = async (req, res, next)=>{
    const { nombre, logo_url } = req.body;


    try{
        const nuevoEquipo = new Equipo({
            nombre,
            logo_url
        });

        await nuevoEquipo.save(); 

        res.json({msg: 'Equipo agregado correctamente'});
    } catch (error) {
        console.log(error);
    }
}



const buscarEquipo = (req, res, next)=>{}

const editarEquipo = async (req, res, next)=>{
    const {id} = req.params;
    const datosActualizados = req.body;

    try{

        const equipo = await Equipo.findByIdAndUpdate(id, datosActualizados, { new: true, runValidators: true } );

        if(!equipo){
           return res.status(404).json({msg: 'Equipo no encontrado'});
        }

        res.status(200).json({msg: 'Equipo actualizado'});

    } catch(error){
        console.log(error);
        return next();
    }
}

const eliminarEquipo = async (req, res, next)=>{
    const {id} = req.params;

    try{
        const equipo = await Equipo.findByIdAndDelete(id);

        if(!equipo){
           return res.status(404).json({msg: 'Equipo no encontrado'})
        }

        res.status(200).json({msg: 'Equipo eliminado correctamente'})
    } catch (error){
        console.log(error)
    }
}

module.exports = {
    verUnSoloEquipo,
    verEquipos,
    subirNuevoEquipo,
    buscarEquipo,
    editarEquipo,
    eliminarEquipo
}