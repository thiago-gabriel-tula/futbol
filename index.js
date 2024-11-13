const express = require('express')
const router = require('./routes/rutas')
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config()

const app = express(process.env.BD);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))

const conectarDb = async ()=>{
    try {
        await mongoose.connect(process.env.BD)
        console.log('Conectado a mongo exitosamente')
    } catch (error) {
        console.log(error);
    }
}

conectarDb();


// manejo de rutas
app.use('/api', router)

app.listen(3000, ()=>{
    console.log('Escuchando en el puerto ' + 3000)
})