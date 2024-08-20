const cartService = require("../services/cart-service");

const storeItem = async (req, res, next) => {
  try {
    const user = req.user;

    const cartItem = await cartService.addItem(user, req.body);

    return res.send({ data: cartItem });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getCartItems = async (req, res, next) => {
  try {
    const user = req.user;

    const cartItems = await cartService.find(user);

    return res.send({ data: cartItems });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const editItemInCart = async (req, res, next) => {
  try {
    const user = req.user;
    await cartService.update(user, req.body);
    const cartItems = await cartService.find(user);

    return res.send({ data: cartItems });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deletCartItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = req.user;
    await cartService.destroy(id, user);
    const cartItems = await cartService.find(user);

    return res.send({ data: cartItems, message: "Deleted item successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = {
  storeItem,
  getCartItems,
  editItemInCart,
  deletCartItem,
};
