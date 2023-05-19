const changePasswordSchema = {
  body: {
    currentPassword: joi
      .string()
      .min(8)
      .regex(/^(?=.*[a-zA-Z])(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]+$/)
      .required()
      .messages({
        'string.pattern.base': 'Password must contain at least one letter and one special character',
        'string.min': 'Password must be at least 8 characters long',
      }),
    newPassword: joi
      .string()
      .min(8)
      .regex(/^(?=.*[a-zA-Z])(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]+$/)
      .required()
      .label('Password')
      .messages({
        'string.pattern.base': 'Password must contain at least one letter and one special character',
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
  changePasswordSchema,
};
