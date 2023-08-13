const { isValidObjectId } = require('mongoose');
const Product = require('../models/Product');
const { filterQuery, parseFilters } = require('../utils/filtering');
const Responser = require('../utils/responser');
const { ValidationError, NotFoundError } = require('../middlewares/errorhandler');

const getProducts = async (req, res, next) => {
  try {
    const {
      q,
      parts,
      limit = 10,
      sort,
      page,
      pmin,
      pmax,
      colors,
      category,
      rating,
      freeDelivery,
      brands,
    } = req.query;
    let query = filterQuery('$and', { q, pmin, pmax, colors, category, rating, freeDelivery, brands });
    const { products, actualProductsLength } = await Product.getProducts(query, limit, page, sort);
    const msg =
      products?.length >= 1 ? 'The data was successfully obtained .' : "There's no data here for now .";
    const responser = new Responser(
      200,
      msg,
      Object.assign(
        { products },
        parts?.includes('filters') && { filters: parseFilters(products) },
        parts?.includes('pagination') && {
          pagination: {
            limit,
            currentPage: page,
            remainingPages: actualProductsLength / +limit > 1 ? Math.ceil(actualProductsLength / +limit) : 0,
            actualProductsLength,
            length: products?.length,
          },
        }
      )
    );

    return responser.respond(res);
  } catch (error) {
    next(error);
  }
};

const getFeatured = async (req, res, next) => {};
const getTopSellers = async (req, res, next) => {};

const getTopRated = async (req, res, next) => {
  try {
    const { limit = 15, page = 1, relatedByCategory = null } = req.query;
    const skip = (+page - 1) * +limit;
    const topRatedProducts = await Product.find({ rating: { $gte: 4 }, category_id: relatedByCategory })
      .skip(skip)
      .limit(limit)
      .select('_id name description price thumbnail images category_id discount rating')
      .populate('category_id', 'name');

    const msg =
      topRatedProducts?.length >= 1
        ? 'The data was successfully obtained .'
        : "There's no data here for now .";
    const responser = new Responser(200, msg, {
      products: topRatedProducts,
      paginition: {
        length: topRatedProducts?.length,
        page,
      },
    });
    return responser.respond(res);
  } catch (error) {
    next(error);
  }
};

const getMegaOffers = async (req, res, next) => {
  try {
    const { page = 1, limit = 3, relatedByCategory = null } = req.query;
    const skip = (+page - 1) * +limit;
    const megaOfferProducts = await Product.find({
      rating: { $gte: 3 },
      discount: { $gte: 10 },
      category_id: relatedByCategory,
    })
      .skip(skip)
      .limit(limit)
      .select('_id name description price thumbnail images category_id discount rating')
      .populate('category_id', 'name');
    const msg =
      megaOfferProducts?.length >= 1
        ? 'The data was successfully obtained .'
        : "There's no data here for now .";
    const responser = new Responser(200, msg, {
      products: megaOfferProducts,
      paginition: {
        length: megaOfferProducts?.length,
        page,
      },
    });
    return responser.respond(res);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) throw new ValidationError('Not a valid product id ' + id);
    const product = await Product.findById(id).populate('category_id', 'name').lean();
    if (!product) return next(new NotFoundError('No product found with this id ' + id));
    let responser = new Responser(200, 'Product details was fetched successfully .', { product });
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
  getFeatured,
  getTopRated,
  getMegaOffers,
  getTopSellers,
};
