const mongoose = require('mongoose');
class CategoryClass {
  static async getIdByName(name) {
    try {
      return await this.findOne({ name: name });
    } catch (error) {
      throw error;
    }
  }
}

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      uniqe: [true, 'category name must be uniqe'],
    },
    description: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

categorySchema.loadClass(CategoryClass);

let Category = mongoose.model('Category', categorySchema);

module.exports = Category;
