const userService = require("../services/userService");

const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    return res.send({ data: users });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedUser = await userService.destroy(id);
    return res.send({ data: deletedUser });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { getUsers, deleteUser };
