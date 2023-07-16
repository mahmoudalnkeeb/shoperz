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
      const { error } = Joi.object(schema.body).validate(body, { abortEarly: false });
      if (error) {
        errors.push(error.details.length == 1 ? error.details[0] : error.details);
      }
    }

    // Validate query
    if (Object.keys(schema.query).length !== 0) {
      const { error } = Joi.object(schema.query).validate(query, { abortEarly: false });
      if (error) {
        errors.push(error.details.length == 1 ? error.details[0] : error.details);
      }
    }

    // Validate params
    if (Object.keys(schema.params).length !== 0) {
      const { error } = Joi.object(schema.params).validate(params, { abortEarly: false });
      if (error) {
        errors.push(error.details.length == 1 ? error.details[0] : error.details);
      }
    }

    if (errors.length > 0) {
      let responser = new Responser(403, 'invalid request data', null, {
        type: 'validation_error',
        errors: errors.flat(),
      });
      return responser.respond(res);
    } else {
      next();
    }
  };
};

module.exports = reqValidator;
