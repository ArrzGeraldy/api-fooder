const Joi = require("joi");

// register validation
const registerValidation = Joi.object({
  username: Joi.string().min(4).max(100).required(),
  email: Joi.string().email().min(4).max(100).required(),
  password: Joi.string().min(4).max(100).required(),
});

// login validation
const loginValidation = Joi.object({
  email: Joi.string().email().min(4).max(100).required(),
  password: Joi.string().min(4).max(100).required(),
});

module.exports = {
  registerValidation,
  loginValidation,
};
