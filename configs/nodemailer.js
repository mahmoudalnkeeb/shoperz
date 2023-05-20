const nodemailer = require('nodemailer');
const envVars = require('./env');
const logger = require('../middlewares/logger');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: envVars.mailHost,
  port: envVars.mailPort,
  auth: {
    user: envVars.mailUser,
    pass: envVars.mailPass,
  },
});

exports.sendEmail = (options) => {
  return new Promise((resolve, reject) => {
    transporter.verify(function (error, success) {
      if (error) {
        logger.error(error);
      } else {
        logger.info('mail service ready');
      }
    });
    transporter.sendMail(options, (err, info) => {
      if (err) reject(err);
      else resolve(info);
    });
  });
};
