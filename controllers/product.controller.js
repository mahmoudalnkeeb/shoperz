const Product = require('../models/Product');
const Responser = require('../utils/responser');

const getProducts = async (req, res, next) => {
  try {
    const { limit, lastId, sort, order } = req.query;

    const products = await Product.find(lastId ? { _id: { $gt: lastId } } : {}, null, {
      limit: limit,
      sort: { [sort]: order == 'asc' ? 1 : -1 },
    }).lean();
    let responser = new Responser(200, 'Success', {
      products,
      count: products.length,
      nextLastId: products[products.length - 1]._id,
    });
    return responser.respond(res);
  } catch (error) {
    next(error);
  }
};
const getProductById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    let responser = new Responser(200, 'Success', { product });
    return responser.respond(res);
  } catch (error) {
    next(error);
  }
};

// dashboard

const createProduct = async (req, res, next) => {
  try {
    const product = new Product(req.body);
    let newProduct = await product.save();
    let responser = new Responser(201, 'created successfully', { newProduct });
    return responser.respond(res);
  } catch (error) {
    next(error);
  }
};

const createProducts = async (req, res, next) => {
  try {
    const products = await Product.create(req.body.products);
    let responser = new Responser(201, 'created successfully', { products });
    return responser.respond(res);
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
    let responser = new Responser(201, 'updated successfully', { product: product._id });
    return responser.respond(res);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);
    let responser = new Responser(200, 'deleted successfully', { product: product._id });
    return responser.respond(res);
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
