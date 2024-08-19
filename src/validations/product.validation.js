const Joi = require("joi");

const createProductValidation = (payload) => {
  const schema = Joi.object({
    name: Joi.string().max(100).min(3).required(),
    description: Joi.string().max(1000).min(5).required(),
    price: Joi.number(),
    category: Joi.string().required(),
    tags: Joi.array().required(),
  });

  return schema.validate(payload);
};

module.exports = { createProductValidation };
