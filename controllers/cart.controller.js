const { InternalError } = require('../middlewares/errorhandler');
const Cart = require('../models/Cart');
const Responser = require('../utils/responser');

const getUserCart = async (req, res, next) => {
  try {
    let userCart = await Cart.findOne({ userId: req.userId }).populate(
      'items.productId',
      '_id name price discount thumbnail'
    );
    if (!userCart) {
      userCart = new Cart({ userId: req.userId });
      await userCart.save();
    }
    const responser = new Responser(200, 'user cart fetched', {
      userCart,
      cartTotal: await Cart.getCartTotal(userCart.items),
      discountedTotal: await Cart.getCartDiscountedTotal(userCart.items),
    });
    responser.respond(res);
  } catch (error) {
    console.log(error);
    next(new InternalError('Internal Error while getting cart items'), error);
  }
};

const getCartById = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const userCart = await Cart.findOne({ userId: req.userId });
    const cartItem = userCart.items.find((item) => item.productId.toString() === productId);
    const responser = new Responser(200, 'user cart fetched', {
      cartItem,
    });
    return responser.respond(res);
  } catch {
    next(new InternalError('Internal Error while getting cart items'), error);
  }
};

const addToCart = async (req, res, next) => {
  try {
    let { productId, quantity } = req.body;
    let userCart = await Cart.findOne({ userId: req.userId }).populate(
      'items.productId',
      '_id name price discount thumbnail'
    );
    if (!userCart) {
      userCart = new Cart({ userId: req.userId });
      await userCart.save();
    }
    let cart = await userCart.addItem(productId, quantity);
    const responser = new Responser(201, 'item add successfully to cart', {
      cart: cart.items,
      cartTotal: await Cart.getCartTotal(userCart.items),
      discountedTotal: await Cart.getCartDiscountedTotal(userCart.items),
    });
    return responser.respond(res);
  } catch (error) {
    console.log(error);
    next(new InternalError('Internal Error while adding item to cart'), error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    let userCart = await Cart.findOne({ userId: req.userId });
    await userCart.removeItem(productId);
    const responser = new Responser(200, 'product deleted successfully', {
      userCart: userCart.items.map((item) => ({ _id: item.productId })),
    });
    responser.respond(res);
  } catch (error) {
    next(new InternalError('Internal Error while removing item from cart'), error);
  }
};

const updateItemQuantity = async (req, res, next) => {
  try {
    let { productId, quantity } = req.params;
    let userCart = await Cart.findOne({ userId: req.userId });
    await userCart.updateItemQuantity(productId, quantity);
    const responser = new Responser(200, 'product quantity changed successfully');
    responser.respond(res);
  } catch (error) {
    if (error.status == 404) return next(error);
    next(new InternalError('Internal Error while updating item quantity'), error);
  }
};

module.exports = { getUserCart, getCartById, addToCart, removeFromCart, updateItemQuantity };
