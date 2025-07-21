const Joi = require('joi');

const createUserSchema = Joi.object({
  name: Joi
    .string()
    .min(3)
    .max(30)
    .required()
    .messages({
      'string.base': `"nombre" debe ser de tipo 'texto'`,
      'string.empty': `"nombre" no puede estar vacío`,
      'string.min': `"nombre" debe tener una longitud mínima de {#limit} caracteres`,
      'any.required': `"nombre" es un campo requerido`,
    }),
  email: Joi
    .string()
    .email({ tlds: { allow: false } }) 
    .required()
    .messages({
      'string.email': `"email" debe ser un email válido`,
      'any.required': `"email" es un campo requerido`,
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': `"contraseña" debe tener una longitud mínima de {#limit} caracteres`,
      'any.required': `"contraseña" es un campo requerido`,
    }),
});

const updateUserSchema = Joi.object({
  name: Joi
    .string()
    .min(3)
    .max(30),
});

const loginSchema = Joi.object({
  email: Joi
    .string()
    .email({ tlds: { allow: false } })
    .required(),
  password: Joi
    .string()
    .required(),
});


module.exports = {
  createUserSchema,
  updateUserSchema,
  loginSchema,
};