const colors = require('colors/safe');

let logger = {
  info: (message) => console.log(colors.cyan(message)),
  error: (error) => console.log(colors.red(error.message)),
  debug: (message) => console.log(colors.gray(message)),
};

module.exports = logger;
