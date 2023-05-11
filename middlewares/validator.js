const Joi = require('joi');

const validator = (schema) => {
  return (req, res, next) => {
    let body = req.body;
    let query = req.query;
    let params = req.params;
    let errors = [];

    // Validate body
    if (Object.keys(schema.body).length !== 0) {
      const { error } = Joi.object(schema.body).validate(body);
      if (error) {
        errors.push({ field: 'body', error: error.details[0].message });
      }
    }

    // Validate query
    if (Object.keys(schema.query).length !== 0) {
      const { error } = Joi.object(schema.query).validate(query);
      if (error) {
        errors.push({ field: 'query', error: error.details[0].message });
      }
    }

    // Validate params
    if (Object.keys(schema.params).length !== 0) {
      const { error } = Joi.object(schema.params).validate(params);
      if (error) {
        errors.push({ field: 'params', error: error.details[0].message });
      }
    }

    if (errors.length > 0) {
      const validationError = makeValidationError(errors);
      res.status(validationError.code).json(validationError);
    } else {
      next();
    }
  };
};

function makeValidationError(errors) {
  return {
    errors,
    message: 'Validation error',
    code: 403,
  };
}

/*
  schema = {
    body:{
      key:{
        type:"string",
        required:true,
        pattern:"regexPattern"
      }
    },
    query:[],
    params:[],
  }
*/

module.exports = validator;
