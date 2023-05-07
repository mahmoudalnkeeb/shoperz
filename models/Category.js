const mongoose = require('mongoose');

class CategoryClass {}

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
