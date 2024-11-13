const path = require('path')
const multer = require('multer');

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Carpeta donde se guardarán los archivos subidos
    cb(null, 'public/img/');
  },
  filename: (req, file, cb) => {
    // Nombre del archivo subido
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Configurar `multer` usando el almacenamiento definido
const upload = multer({storage});

module.exports = upload;
