const mongoose = require('mongoose');

class WishlistClass {
  static async addToWishlist(wishlistId, productId) {
    try {
      return await this.findByIdAndUpdate(wishlistId, { $push: { products: productId } });
    } catch (error) {
      // Handle error
      console.error('Error adding product to wishlist:', error);
      throw error;
    }
  }

  static async removeFromWishlist(wishlistId, productId) {
    try {
      return await this.findByIdAndUpdate(wishlistId, { $pull: { products: productId } });
    } catch (error) {
      // Handle error
      console.error('Error removing product from wishlist:', error);
      throw error;
    }
  }
}

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
  }
);

wishlistSchema.loadClass(WishlistClass);

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;
