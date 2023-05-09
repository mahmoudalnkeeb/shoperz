const Category = require('../models/Category');

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

const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    await category.save();
    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = await Category.findByIdAndUpdate(id, req.body, { new: true });
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

module.exports = { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
