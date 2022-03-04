var mongoose = require('mongoose');
require('dotenv/config');

mongoose.connect(process.env.DB_CONNECTION, {  useUnifiedTopology: true, useNewUrlParser: true }, function (error) {
  if (error) {
    throw error;
    console.log('No se pudo conectar a la base de datos.');
  } else {
    mongoose.set('runValidators', true);
    console.log('Conectado a MongoDB.');
  }
});

module.exports = mongoose;
