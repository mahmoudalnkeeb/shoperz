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
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

categorySchema.loadClass(CategoryClass);

let Category = mongoose.model('Category', categorySchema);

module.exports = Category;
