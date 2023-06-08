const mongoose = require('mongoose');

class ProductClass {
  async getDiscountedPrice() {
    return (this.price * ((100 - this.discount) / 100)).toFixed(2);
  }
}

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    images: {
      type: [String],
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    sku: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    colors: {
      type: [String],
      required: true,
      default: [],
    },
    specifications: {
      type: mongoose.Schema.Types.Mixed,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      required: true,
      default: 0,
    },
    isInCart: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

productSchema.loadClass(ProductClass);
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
