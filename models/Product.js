const mongoose = require('mongoose');

class ProductClass {
  async getDiscountedPrice() {
    return (this.price * ((100 - this.discount) / 100)).toFixed(2);
  }
  static async docCount(productQuery) {
    let actualProductsLength = await Product.find({}).countDocuments();
    return actualProductsLength;
  }
  static async pagination({ limit, page }, productQuery) {
    productQuery.limit(limit).skip(page * +limit);
  }
  static async filtration(query, productQuery) {
    // const query = Object.entries(query);
    const excludedField = ['sort', 'limit', 'page'];
    const stringQuery = {};
    Object.entries(query).forEach(([key, value], idx) => {
      if (excludedField.at(idx) !== key) {
        const newValue = JSON.stringify(value).replace(/(gte|lte|lt|gt|equal)/g, (match) => `$${match}`);
        stringQuery[key] = JSON.parse(newValue);
      }
    });
    productQuery.find({ ...stringQuery });
  }
  static async sorting({ sort }, productQuery) {
    if (sort) {
      if (sort.includes(',')) {
        productQuery.sort(sort.split(',').join(' '));
      }
      productQuery.sort(sort);
    } else {
      productQuery.sort('-createdAt');
    }
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
