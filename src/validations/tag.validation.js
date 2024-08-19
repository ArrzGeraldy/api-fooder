const Joi = require("joi");

const tagValidation = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  category: Joi.string().required(),
});

module.exports = {
  tagValidation,
};
