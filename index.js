const express = require('express')
const router = require('./routes/rutas')
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, '/.env')})

const app = express(process.env.BD);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))

const conectarDb = async ()=>{
    try {
        await mongoose.connect('mongodb://thiago:14042004@ac-ge0zp8i-shard-00-00.yzcca3i.mongodb.net:27017,ac-ge0zp8i-shard-00-01.yzcca3i.mongodb.net:27017,ac-ge0zp8i-shard-00-02.yzcca3i.mongodb.net:27017/nba?ssl=true&replicaSet=atlas-opqq8l-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0')
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