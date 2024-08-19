const Joi = require("joi");

const createTagValidation = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  category: Joi.string().required(),
});

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
