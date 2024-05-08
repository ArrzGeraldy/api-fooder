const AddressDelivery = require("../models/addressDelivery.model");
const { responseError } = require("../utils/response");
const logger = require("../utils/logger");
const { findUserByEmail } = require("../services/userService");
const {
  createAddressValidation,
} = require("../validations/address.validation");

const createAddress = async (req, res) => {
  try {
    const { error, value } = createAddressValidation(req.body);
    if (error) {
      logger.error(`Error: ${error.details[0].message}`);
      return responseError(res, 400, `${error.details[0].message}`, false);
    }

    const user = req.user;

    const foundUser = await findUserByEmail(user.email);

    if (!foundUser) {
      logger.error("User not found");
      return res.sendStatus(403);
    }

    const { city, phone, name, detail, province } = value;

    const address = await AddressDelivery.create({
      user: foundUser._id,
      city,
      province,
      phone,
      name,
      detail,
    });

    logger.info("Create address successfully");
    return res.send({ data: address });
  } catch (error) {
    console.log(error);
    logger.error("Internal server error");

    return responseError(res, 500, "Internal server error");
  }
};

const getAddressUser = async (req, res) => {
  try {
    const user = req.user;

    const foundUser = await findUserByEmail(user.email);
    if (!foundUser) return res.sendStatus(403);

    const addresses = await AddressDelivery.find({ user: foundUser._id });

    logger.info("get user addresses successfully");
    return res.send({ data: addresses });
  } catch (error) {
    console.log(error);
    logger.error("get address user controller error");
    return responseError(res, 500, "Internal server error");
  }
};

const editAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const { error, value } = createAddressValidation(req.body);
    if (error) {
      logger.error(`Error: ${error.details[0].message}`);
      return responseError(res, 400, `${error.details[0].message}`, false);
    }

    const user = req.user;

    const foundUser = await findUserByEmail(user.email);

    if (!foundUser) return res.sendStatus(403);

    const updateAddress = await AddressDelivery.findOneAndUpdate(
      { _id: id },
      {
        name: value.name,
        phone: value.phone,
        province: value.province,
        city: value.city,
        detail: value.detail,
      },
      { new: true }
    );

    if (!updateAddress) {
      return responseError(res, 400, "Failed update address");
    }

    return res.send({ data: updateAddress });
  } catch (error) {
    console.log(error);
    return responseError(res, 500, "Internal server error");
  }
};

const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const user = req.user;

    const foundUser = await findUserByEmail(user.email);

    if (!foundUser) return res.sendStatus(403);

    const result = await AddressDelivery.findByIdAndDelete({ _id: id });

    if (!result) {
      return responseError(res, 400, "Failed delete address");
    }

    const addresses = await AddressDelivery.find({ user: foundUser._id });

    return res.send({ data: addresses, message: "Success delete address" });
  } catch (error) {
    console.log(error);
    return responseError(res, 500, "Internal server error");
  }
};
module.exports = { createAddress, getAddressUser, editAddress, deleteAddress };
