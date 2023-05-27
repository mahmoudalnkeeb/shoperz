const {
  getUserCart,
  addToCart,
  removeFromCart,
  updateItemQuantity,
} = require('../controllers/cart.controller');
const authMiddleware = require('../middlewares/authentication');
const cartRouter = require('express').Router();

cartRouter.get('/', authMiddleware, getUserCart);
cartRouter.post('/', authMiddleware, addToCart);
cartRouter.put('/:productId/:quantity', authMiddleware, updateItemQuantity);
cartRouter.delete('/:productId', authMiddleware, removeFromCart);

module.exports = cartRouter;
