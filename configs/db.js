const mongoose = require('mongoose');
const logger = require('../middlewares/logger');

const connectDB = () => {
  mongoose
    .connect(process.env.URI, { useNewUrlParser: true, useUnifiedTopology: true, dbName: process.env.DB_NAME })
    .then((res) => {
      logger.info(`connected to ${res.connections[0].name} database`);
    })
    .catch((err) => {
      logger.error('Failed to connect', err);
    });
};

module.exports = connectDB;
