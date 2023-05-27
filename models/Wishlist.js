const mongoose = require('mongoose');

class WishlistClass {
  // statics
  static async addToWishlist(userId, productId) {
    try {
      return await this.findOneAndUpdate({ userId }, { $push: { products: productId } }, { new: true });
    } catch (error) {
      console.error('Error adding product to wishlist:', error);
      throw error;
    }
  }

  static async removeFromWishlist(userId, productId) {
    try {
      return await this.findOneAndUpdate({ userId }, { $pull: { products: productId } }, { new: true });
    } catch (error) {
      console.error('Error removing product from wishlist:', error);
      throw error;
    }
  }

  // create user wishlist
  static async createUserWishlist(userId) {
    try {
      let wishlist = new this({ userId });
      let userWishlist = await wishlist.save();
      return userWishlist;
    } catch (error) {
      throw new Error('error in creating user wishlist', error);
    }
  }
}

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    products: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

wishlistSchema.loadClass(WishlistClass);

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;
