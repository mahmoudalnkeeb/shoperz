const {
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
} = require('../controllers/product.controller');
const authMiddleware = require('../middlewares/authentication');
const authorize = require('../middlewares/authorization');

const productRouter = require('express').Router();

productRouter.get('/', getProducts);
productRouter.get('/featured', getFeatured);
productRouter.get('/top-rated', getTopRated);
productRouter.get('/mega-offers', getMegaOffers);
productRouter.get('/top-sellers', getTopSellers);
productRouter.get('/search', searchInProducts);
productRouter.get('/:id', getProductById);
// dashboard
productRouter.post('/', authMiddleware, authorize('ADMIN'), createProduct);
productRouter.post('/multi', authMiddleware, authorize('ADMIN'), createProducts);
productRouter.put('/:id', authMiddleware, authorize('ADMIN'), updateProduct);
productRouter.delete('/', authMiddleware, authorize('ADMIN'), deleteProduct);

module.exports = productRouter;
