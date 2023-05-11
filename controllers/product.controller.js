/*

async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};

*/

const Product = require('../models/Product');

const getProducts = async (req, res, next) => {
  try {
    const { limit, lastId } = req.query;
    const products = await Product.find({ _id: { $gt: lastId } }, null, {
      limit: limit,
    });
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};
const getProductById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = new Product(req.body);
    let newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

const createProducts = async (req, res, next) => {
  try {
    const products = await Product.create(req.body.products);
    res.status(201).json(products);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    await product.save();
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getProducts,
  getProductById,
  createProduct,
  createProducts,
  updateProduct,
  deleteProduct,
};
