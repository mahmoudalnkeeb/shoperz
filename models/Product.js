const mongoose = require('mongoose');

class ProductClass {
  async getDiscountedPrice() {
    return (this.price * ((100 - this.discount) / 100)).toFixed(2);
  }
  static async getProducts(query = {}, limit = 10, page = 1, sort) {
    return {
      products: await this.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort(sort ? (sort.includes(',') ? sort.split(',').join(' ') : JSON.parse(sort)) : '-createdAt')
        .select(' _id category_id name colors brand rating price thumbnail description sku createdAt')
        .populate({ path: 'category_id', select: 'name' })
        .lean(),
      actualProductsLength: await this.find(query).countDocuments(),
    };
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
      type: [
        {
          url: String,
          path: String,
        },
      ],
      required: true,
      default: [],
    },
    thumbnail: {
      type: {
        url: String,
        path: String,
      },
      required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
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
    deliveryCost: {
      type: Number,
      required: true,
      default: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

productSchema.loadClass(ProductClass);
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
