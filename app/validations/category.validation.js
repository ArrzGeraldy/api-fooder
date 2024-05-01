const Joi = require("joi");

// create validation
const createCategoryValidation = (payload) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
  });

  return schema.validate(payload);
};

module.exports = {
  createCategoryValidation,
};
