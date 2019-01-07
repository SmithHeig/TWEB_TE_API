require('dotenv').config();
const mongoose = require('mongoose');
const config = require('../src/config/config');
mongoose.Promise = require('bluebird');

mongoose.connect(config.db, { useNewUrlParser: true })
  .then(() => console.log(`connecté à la base de donnée de ${process.env.NODE_ENV} --> ${config.db}`))
  .catch(error => console.log(`la connexion à la database ${config.db} a échoué\n${error.message}`));
