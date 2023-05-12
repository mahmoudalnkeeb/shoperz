const chalk = require('chalk');
const logger = require('./logger');

const errHandler = (error, req, res, next) => {
  if (error) {
    console.log(error);
    logger.error(chalk.red(error));
    res.status(500).send('Internal Error!');
  }
};

module.exports = errHandler;
