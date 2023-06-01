const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlist.controller');
const authMiddleware = require('../middlewares/authentication');

const wishlistRouter = require('express').Router();

wishlistRouter.get('/', authMiddleware, getWishlist);
wishlistRouter.post('/', authMiddleware, addToWishlist);
wishlistRouter.delete('/', authMiddleware, removeFromWishlist);

module.exports = wishlistRouter;
