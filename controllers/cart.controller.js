const { InternalError } = require('../middlewares/errorhandler');
const { Cart } = require('../models/Cart');

const getUserCart = async (req, res, next) => {
  try {
    let userCart = await Cart.findOne({ userId: req.userId });
    res.status(200).json({
      userCart,
      cartTotal: await userCart.getCartTotal(),
      discountedTotal: await userCart.getCartDiscountedTotal(),
    });
  } catch (error) {
    next(new InternalError('Internal Error while getting cart items'), error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    let { productId, quantity } = req.body;
    let userCart = await Cart.findOne({ userId: req.userId });
    if (!userCart) {
      userCart = new Cart({ userId: req.userId });
      await userCart.save();
    }
    let cart = await userCart.addItem(productId, quantity);
    return res.status(201).json({
      message: 'item add successfully to cart',
      cart,
      cartTotal: await cart.getCartTotal(),
      discountedTotal: await cart.getCartDiscountedTotal(),
    });
  } catch (error) {
    console.log(error);
    next(new InternalError('Internal Error while adding item to cart'), error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    let userCart = await Cart.findOne({ userId: req.userId });
    await userCart.removeItem(productId);
    res.status(200).json({ message: 'product deleted successfully' });
  } catch (error) {
    console.log(error);
    next(new InternalError('Internal Error while removing item from cart'), error);
  }
};
const updateItemQuantity = async (req, res, next) => {
  try {
    let { productId, quantity } = req.params;
    let userCart = await Cart.findOne({ userId: req.userId });
    await userCart.updateItemQuantity(productId, quantity);
    res.status(200).json({ message: 'product quantity changed successfully' });
  } catch (error) {
    if (error.status == 404) return next(error);
    next(new InternalError('Internal Error while updating item quantity'), error);
  }
};

module.exports = { getUserCart, addToCart, removeFromCart, updateItemQuantity };
