const {
  getUserCart,
  getCartById,
  addToCart,
  removeFromCart,
  updateItemQuantity,
  clearCart,
} = require('../controllers/cart.controller');
const authMiddleware = require('../middlewares/authentication');
const cartRouter = require('express').Router();

cartRouter.get('/', authMiddleware, getUserCart);
cartRouter.get('/:productId', authMiddleware, getCartById);
cartRouter.post('/', authMiddleware, addToCart);
cartRouter.put('/:productId/:quantity', authMiddleware, updateItemQuantity);
cartRouter.delete('/:productId', authMiddleware, removeFromCart);
cartRouter.delete('/clear', authMiddleware, clearCart);

module.exports = cartRouter;
