const Category = require('../models/Category');
const slugify = require('slugify');
const Responser = require('../utils/responser');

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({}).select('_id , name , description , slug , image');
    const responser = new Responser(200, 'The list of categories was successfully fetched', {
      categories,
    });
    responser.respond(res);
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id).select('_id , name , description , slug , image');
    const responser = new Responser(200, 'The list of categories was successfully fetched', {
      categories: category,
    });
    responser.respond(res);
  } catch (error) {
    next(error);
  }
};

// dashboard

const createCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;
    const isExists = await Category.findOne({ name });
    if (Boolean(isExists)) {
      const responser = new Responser(400, 'this category item is already exist ');
      responser.respond(res);
    } else {
      const category = new Category({
        name,
        description,
        image,
        slug: slugify(name),
      });
      const newCategory = await category.save();
      const responser = new Responser(201, 'category was created successfully ', newCategory);
      responser.respond(res);
    }
  } catch (error) {
    next(error);
  }
};

const createCategories = async (req, res, next) => {
  try {
    const { categories } = req.body;
    let categoriesList = await Category.create(categories);
    const responser = new Responser(201, 'category was created successfully ', categoriesList);
    responser.respond(res);
    // const isExists = await Category.findOne({ name: categories.name   });
    // if (Boolean(isExists)) {
    //   const responser = new Responser(400, "thers's a category item inside this array is already exist");
    //   responser.respond(res);
    // } else {
    //   await Category.create(categories);
    //   const responser = new Responser(201, 'category was created successfully ');
    //   responser.respond(res);
    // }
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const modifiedCategory = req.body;
    const isExists = await Category.findById(id);
    if (!Boolean(isExists)) {
      const responser = new Responser(404, 'This category item is not exist in DB to update ! ', {
        categories: category,
      });
      return responser.respond(res);
    } else {
      const category = await Category.findByIdAndUpdate(id, modifiedCategory, {
        new: true,
      });
      await category.save();
    }
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isExists = await Category.findById(id);
    if (!Boolean(isExists)) {
      const responser = new Responser(404, 'This Category item is not exists');
      return responser.respond(res);
    } else {
      const category = await Category.findByIdAndDelete(id);
      const responser = new Responser(200, 'The Category was deleted successfully', {
        categories: category,
      });
      return responser.respond(res);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  createCategories,
  updateCategory,
  deleteCategory,
};
