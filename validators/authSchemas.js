const joi = require('joi');

/**
 
const schema = {
  body:{},
  query:{},
  params:{}
}
*/

const signupSchema = {
  body: {
    fullname: joi.string().required(),
    email: joi.string().email().required(),
    password: joi
      .string()
      .min(8)
      .regex(/^(?=.*[a-zA-Z])(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]+$/)
      .required()
      .messages({
        'string.pattern.base':
          'Password must contain at least one letter and one special character',
        'string.min': 'Password must be at least 8 characters long',
      }),
    phone: joi.string().required(),
  },
  query: {},
  params: {},
};
const loginSchema = {
  body: {
    email: joi.string().email().required(),
    password: joi.string().required(),
  },
  query: {},
  params: {},
};

const verfiyEmailSchema = {
  body: {},
  query: {
    token: joi.string().required(),
  },
  params: {},
};

const changePasswordSchema = {
  body: {
    currentPassword: joi
      .string()
      .min(8)
      .regex(/^(?=.*[a-zA-Z])(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]+$/)
      .required()
      .messages({
        'string.pattern.base':
          'Password must contain at least one letter and one special character',
        'string.min': 'Password must be at least 8 characters long',
      }),
    newPassword: joi
      .string()
      .min(8)
      .regex(/^(?=.*[a-zA-Z])(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]+$/)
      .required()
      .label('Password')
      .messages({
        'string.pattern.base':
          'Password must contain at least one letter and one special character',
        'string.min': 'Password must be at least 8 characters long',
      }),
    newPasswordRepeat: joi
      .string()
      .valid(joi.ref('newPassword'))
      .required()
      .label('new Password Confirmation')
      .messages({ 'any.only': 'Passwords do not match' }),
  },
};
module.exports = {
  signupSchema,
  loginSchema,
  verfiyEmailSchema,
  changePasswordSchema
};
