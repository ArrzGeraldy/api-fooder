const logger = require("../utils/logger");

const addressService = require("../services/address-service.js");

const createAddress = async (req, res, next) => {
  try {
    const user = req.user;

    const address = await addressService.create(req.body, user);
    return res.send({ data: address });
  } catch (error) {
    console.log(error);
    logger.error("Internal server error");

    next(error);
  }
};

const getAddressUser = async (req, res, next) => {
  try {
    const user = req.user;

    const addresses = await addressService.findAddress(user);

    logger.info("get user addresses successfully");
    return res.send({ data: addresses });
  } catch (error) {
    console.log(error);
    logger.error("get address user controller error");
    next(error);
  }
};

const editAddress = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = req.user;

    const updateAddress = await addressService.update(id, user, req.body);
    return res.send({ data: updateAddress });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = req.user;

    await addressService.destroy(id, user);

    return res.send({ data: "", message: "Success delete address" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { createAddress, getAddressUser, editAddress, deleteAddress };
