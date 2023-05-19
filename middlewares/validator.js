const Joi = require('joi');
const Responser = require('../utils/responser');

const reqValidator = (schema) => {
  return (req, res, next) => {
    let body = req.body;
    let query = req.query;
    let params = req.params;
    let errors = [];

    // Validate body
    if (Object.keys(schema.body).length !== 0) {
      const { error } = Joi.object(schema.body).validate(body);
      if (error) {
        errors.push({ field: 'body', error: error.details });
      }
    }

    // Validate query
    if (Object.keys(schema.query).length !== 0) {
      const { error } = Joi.object(schema.query).validate(query);
      if (error) {
        errors.push({ field: 'query', error: error.details });
      }
    }

    // Validate params
    if (Object.keys(schema.params).length !== 0) {
      const { error } = Joi.object(schema.params).validate(params);
      if (error) {
        errors.push({ field: 'params', error: error.details });
      }
    }

    if (errors.length > 0) {
      let responser = new Responser(403, 'invalid request data', null, errors);
      return responser.respond(res);
    } else {
      next();
    }
  };
};

module.exports = reqValidator;
