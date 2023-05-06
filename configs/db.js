const mongoose = require('mongoose');
const logger = require('../middlewares/logger');
const envVars = require('./env');

const connectDB = () => {
  mongoose
    .connect(envVars.dbURI, { useNewUrlParser: true, useUnifiedTopology: true, dbName: envVars.dbName })
    .then((res) => {
      logger.info(`connected to ${res.connections[0].name} database`);
    })
    .catch((err) => {
      logger.error('Failed to connect', err);
    });
};

module.exports = connectDB;
