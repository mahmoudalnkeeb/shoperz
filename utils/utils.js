const ejs = require('ejs');

function renderTemplate(template, data) {
  return new Promise((resolve, reject) => {
    ejs.renderFile(template, data, (err, html) => {
      if (err) reject(err);
      else resolve(html);
    });
  });
}

module.exports = { renderTemplate };
