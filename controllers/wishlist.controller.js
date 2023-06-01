const { InternalError } = require('../middlewares/errorhandler');
const Wishlist = require('../models/Wishlist');
const Responser = require('../utils/responser');

const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.userId });
    let responser = new Responser(200, 'wishlist fetched', { wishlist });
    responser.respond(res);
  } catch (error) {
    next(new InternalError('Internal error', error.message));
  }
};

const addToWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.addToWishlist(req.userId, req.body.productId);
    let responser = new Responser(201, 'added to wishlist', { wishlist });
    responser.respond(res);
  } catch (error) {
    next(new InternalError('Internal error', error.message));
  }
};

const removeFromWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.removeFromWishlist(req.userId, req.body.productId);
    let responser = new Responser(201, 'removed from wishlist', { wishlist });
    responser.respond(res);
  } catch (error) {
    next(new InternalError('Internal error', error.message));
  }
};
module.exports = { getWishlist, addToWishlist, removeFromWishlist };
