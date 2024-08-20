const Joi = require("joi");

const addressValidation = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  phone: Joi.string().min(4).max(20).required(),
  province: Joi.string().min(4).max(100).required(),
  city: Joi.string().min(4).max(100).required(),
  detail: Joi.string().min(4).required(),
});

module.exports = { addressValidation };
