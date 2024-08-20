const ResponseError = require("../error/response-error");
const AddressDelivery = require("../models/addressDelivery.model");
const { addressValidation } = require("../validations/address.validation");
const validate = require("../validations/validate");
const userHelper = require("../utils/user-helper.js");

const create = async (request, user) => {
  const addressRequest = validate(addressValidation, request);

  const foundUser = await userHelper.checkUser(user);

  const { city, phone, name, detail, province } = addressRequest;

  return AddressDelivery.create({
    user: foundUser._id,
    city,
    phone,
    name,
    detail,
    province,
  });
};

const findAddress = async (user) => {
  const foundUser = await userHelper.checkUser(user);

  return AddressDelivery.find({ user: foundUser._id });
};

const update = async (id, user, request) => {
  await userHelper.checkUser(user);
  const updateRequest = validate(addressValidation, request);

  const updateAddress = await AddressDelivery.findOneAndUpdate(
    { _id: id },
    {
      name: updateRequest.name,
      phone: updateRequest.phone,
      province: updateRequest.province,
      city: updateRequest.city,
      detail: updateRequest.detail,
    },
    { new: true }
  );

  if (!updateAddress) throw new ResponseError(400, "Failed Edit Address");

  return updateAddress;
};

const destroy = async (id, user) => {
  await userHelper.checkUser(user);

  const result = await AddressDelivery.findByIdAndDelete({ _id: id });

  if (!result) throw new ResponseError(400, "Failed Delete Address");
};

module.exports = {
  create,
  findAddress,
  destroy,
  update,
};
