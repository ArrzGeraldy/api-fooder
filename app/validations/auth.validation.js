const Joi = require("joi");

// register validation
const registerValidation = (payload) => {
  const schema = Joi.object({
    username: Joi.string().min(4).max(100).required(),
    email: Joi.string().email().min(4).max(100).required(),
    password: Joi.string().min(4).max(100).required(),
  });

  return schema.validate(payload);
};

// login validation
const loginValidation = (payload) => {
  const schema = Joi.object({
    email: Joi.string().email().min(4).max(100).required(),
    password: Joi.string().min(4).max(100).required(),
  });

  return schema.validate(payload);
};
module.exports = {
  registerValidation,
  loginValidation,
};
