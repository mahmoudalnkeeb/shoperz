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

console.log({
  user: envVars.mailUser,
  pass: envVars.mailPass,
});
transporter.verify(function (error, success) {
  if (error) {
    logger.error(error);
  } else {
    logger.info('mail service running');
  }
});

exports.sendEmail = (mailOptions, cb) => {
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) logger.error(err);
    else cb(info);
  });
};
