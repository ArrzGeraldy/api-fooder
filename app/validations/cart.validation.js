const Joi = require("joi");

const storeCartItemValidation = (payload) => {
  const schema = Joi.object({
    itemId: Joi.string().required(),
    quantity: Joi.number().required(),
  });

  return schema.validate(payload);
};

module.exports = { storeCartItemValidation };
