const mongoose = require('mongoose');
const { default: slugify } = require('slugify');
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
    image: {
      type: String,
    },
    slug: {
      type: String,
      lowercase: true,
    },
  },
  { timestamps: true }
);

categorySchema.loadClass(CategoryClass);

categorySchema.pre('save', function (next) {
  if (!this.isModified('name')) {
    return next();
  }

  this.slug = slugify(this.name);
  next();
});


let Category = mongoose.model('Category', categorySchema);

module.exports = Category;
