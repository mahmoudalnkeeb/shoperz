const ejs = require('ejs');
const bcrypt = require('bcrypt');
const envVars = require('../configs/env');
function renderTemplate(template, data) {
  return new Promise((resolve, reject) => {
    ejs.renderFile(template, data, (err, html) => {
      if (err) reject(err);
      else resolve(html);
    });
  });
}

function hashPassword(password) {
  let salt = bcrypt.genSaltSync(envVars.slatRounds);
  let hash = bcrypt.hashSync(password, salt);
  return hash;
}

module.exports = { renderTemplate, hashPassword };
