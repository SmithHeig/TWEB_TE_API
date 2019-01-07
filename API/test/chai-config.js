require('dotenv').config();
const chai = require('chai');
const chaiHttp = require('chai-http');
const dirty = require('dirty-chai');
const mongoose = require('mongoose');
const config = require('../src/config/config');
mongoose.Promise = require('bluebird');

mongoose.connect(config.db, { useNewUrlParser: true })
  .then(() => console.log(`connecté à la base de donnée de ${process.env.NODE_ENV} --> ${config.db}`))
  .catch(error => console.log(`la connexion à la database ${config.db} a échoué\n${error.message}`));

chai.use(chaiHttp);
chai.should();
chai.use(dirty);
global.expect = chai.expect;
