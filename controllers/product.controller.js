const Product = require('../models/Product');
const Responser = require('../utils/responser');

const getProducts = async (req, res, next) => {
  try {
    const { sort, limit = 10, page = 1 } = req.query;

    // setup query in the products model
    let productQuery = Product.find();

    // Paginition
    Product.pagination(req.query, productQuery);

    //Filtertion
    Product.filtration(req.query, productQuery);

    //sorting products
    Product.sorting(req.query, productQuery);

    const productsList = await productQuery
      .select('_id, category_id , name , rating , price , thumbnail , description,sku')
      .populate({ path: 'category_id', select: 'namme , _id' })
      .lean();

    const actualProductsLength = +Product.docCount(productQuery);
    const responser = new Responser(200, 'The list of products has been successfully brought', {
      products: productsList,
      paginition: {
        limit,
        currentPage: page,
        remainingPages: Math.ceil(actualProductsLength / +limit),
        length: productsList?.length,
      },
    });
    return responser.respond(res);
    //
    //
    // const { limit, lastId, sort, order } = req.query;
    // console.log({ limit, lastId, sort, order });
    // const products = await Product.find(lastId ? { _id: { $gt: lastId } } : {}, null, {
    //   limit: limit,
    //   sort: { [sort]: order == 'asc' ? 1 : -1 },
    // }).lean();
    // let responser = new Responser(200, 'Success', {
    //   products,
    //   count: products.length,
    //   nextLastId: products[products.length - 1]._id,
    // });
    // return responser.respond(res);
  } catch (error) {
    next(error);
  }
};

const getFeatured = async (req, res, next) => {};
const getTopSellers = async (req, res, next) => {};

// @desc get top rated products , can search with products related by specific category
// @route /products/top-rated
// @access Public
// @params { limit: number , page : number ,relatedByCategory: ObjectId }

const getTopRated = async (req, res, next) => {
  try {
    //
    const { limit = 15, page = 1, relatedByCategory } = req.query;
    const skip = +page * +limit;
    const query = Product.find();
    if (!relatedByCategory) {
      query.where('rating').gte(4.0);
      query.limit(limit);
      query.skip(skip);
    } else {
      query.where('rating').gte(4.0);
      query.limit(limit);
      query.skip(skip);
      query.where('category_id', relatedByCategory);
    }
    const topRatedProducts = await query;
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
    //
    next(error);
  }
};

// @desc get big offered products , can search with products related by specific category
// @route /products/mega-offers
// @access Public
// @params { limit: number , page : number ,relatedByCategory: ObjectId }

const getMegaOffers = async (req, res, next) => {
  try {
    const { page = 1, limit = 3, relatedByCategory } = req.query;
    const skip = +page * +limit;

    const query = Product.find();
    if (!relatedByCategory) {
      query.where('discount').gte(10);
      query.where('rating').gte(3.0);
      query.skip(skip);
      query.limit(limit);
    } else {
      query.where('discount').gte(10);
      query.where('rating').gte(3.0);
      query.skip(skip);
      query.limit(limit);
      query.where('category_id', relatedByCategory);
    }
    const megaOfferProducts = await query;
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

// @desc search inside the products and return list of matched product
// @route /products/search
// @access Public
// query { q : string }

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
const searchInProducts = async (req, res, next) => {
  try {
    const { q } = req.query;
    const regexQuery = new RegExp(`^${q}`, 'i', 'g');
    const products = await Product.find({ name: { $regex: regexQuery } }).select('_id name thumbnail');

    const msg =
      products?.length >= 1 ? 'The data was successfully obtained .' : "There's no data here for now .";
    const responser = new Responser(200, msg, {
      products,
      paginition: {
        length: products?.length,
      },
    });

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
  searchInProducts,
};
