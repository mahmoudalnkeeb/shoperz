const Category = require('../models/Category');
const slugify = require('slugify');

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(201).json(categories);
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = await Category.findById(id);
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

// dashboard

const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const category = new Category({
      name,
      description,
      slug: slugify(name),
    });
    const newCategory = await category.save();
    res.status(200).json(newCategory);
  } catch (error) {
    next(error);
  }
};

const createCategories = async (req, res, next) => {
  try {
    const categories = await Category.create(req.body.categories);
    res.status(201).json(categories);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = await Category.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    await category.save();
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = await Category.findByIdAndDelete(id);
    res.status(200).json(category);
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
