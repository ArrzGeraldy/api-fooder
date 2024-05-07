const AddressDelivery = require("../models/addressDelivery.model");
const User = require("../models/user.model");
const Cart = require("../models/cart.model");
const { getAllUsers, deleteUserFromDb } = require("../services/userService");
const { responseError } = require("../utils/response");

const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    return res.send({ data: users });
  } catch (error) {
    console.log(error);
    return responseError(res, 500, "Internal server error");
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const foundUser = await User.findOne({ _id: id });

    // Hapus user dari database
    const deletedUser = await deleteUserFromDb(id);

    if (deletedUser) {
      // Hapus address delivery terkait dengan user

      await AddressDelivery.deleteMany({ user: foundUser._id });

      // Hapus cart terkait dengan user
      await Cart.deleteMany({ user: foundUser._id });

      console.log("User and related data successfully deleted");
      return res.send({
        message: "User and related data successfully deleted",
      });
    }
    if (!deletedUser) return responseError(res, 400, "Failed delete user");

    return res.send({ data: deletedUser });
  } catch (error) {
    console.log(error);
    return responseError(res, 500, "Internal server error");
  }
};

module.exports = { getUsers, deleteUser };
