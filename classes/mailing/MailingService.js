class MailingService {
  constructor(config, nodemailer, logger) {
    this.transporter = nodemailer.createTransport(config);

    this.transporter.verify((error, success) => {
      if (error) {
        logger.error(error);
      } else {
        logger.info('mail service ready');
      }
    });
  }

  sendEmail(options) {
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(options, (err, info) => {
        if (err) reject(err);
        else resolve(info);
      });
    });
  }
}

module.exports = MailingService;
