const chalk = require('chalk');
const logger = require('./logger');

const errHandler = (error, req, res, next) => {
  if (error) {
    console.error(chalk.red(`message:${error.message}\ncause:${error.cause}`));
    logger.error(error);
    res.status(error.status || 500).send({
      status: error.status || 500,
      message: error.message || 'internal error',
      type: error.type || 'internal',
    });
  }
};

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404;
    this.type = 'not_found';
  }
}

class InternalError extends Error {
  constructor(message, cause) {
    super(message);
    this.name = 'InternalError';
    this.status = 500;
    this.type = 'internal_error';
    this.cause = cause;
  }
}
module.exports = { errHandler, NotFoundError, InternalError };
