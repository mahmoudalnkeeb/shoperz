const mongoose = require('mongoose');
const envVars = require('./env');
const colors = require('../utils/colors');
const connectDB = (startServer) => {
  mongoose.connection
    .on('error', () => console.log(colors.error('Failed to connect to database')))
    .on('connected', () => console.log(colors.verbose('---\nDATABASE CONNECTED\n---')))
    .on('disconnected', connectDB)
    .once('open', startServer);
  return mongoose.connect(envVars.dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: envVars.dbName,
  });
};

module.exports = connectDB;
