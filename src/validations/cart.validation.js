const Joi = require("joi");

const cartItemValidation = Joi.object({
  itemId: Joi.string().required(),
  quantity: Joi.number().required(),
});

module.exports = { cartItemValidation };
