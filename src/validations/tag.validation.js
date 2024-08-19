const Joi = require("joi");

// create validation
const createTagValidation = (payload) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    category: Joi.string().required(),
  });

  return schema.validate(payload);
};

const updateTagValidation = (payload) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    category: Joi.string().allow("", null),
  });

  return schema.validate(payload);
};

module.exports = {
  createTagValidation,
  updateTagValidation,
};
