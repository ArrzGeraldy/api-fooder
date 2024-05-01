const Joi = require("joi");

// create address validation
const createAddressValidation = (payload) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    phone: Joi.string().min(4).max(20).required(),
    province: Joi.string().min(4).max(100).required(),
    city: Joi.string().min(4).max(100).required(),
    detail: Joi.string().min(4).required(),
  });

  return schema.validate(payload);
};

module.exports = { createAddressValidation };
