const {
  getProducts,
  getProductById,
  createProduct,
  createProducts,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');
const authMiddleware = require('../middlewares/authentication');
const authorize = require('../middlewares/authorization');

const productRouter = require('express').Router();

productRouter.get('/', getProducts);
productRouter.get('/:id', getProductById);
// dashboard
productRouter.post('/', authMiddleware, authorize('ADMIN'), createProduct);
productRouter.post('/multi', authMiddleware, authorize('ADMIN'), createProducts);
productRouter.put('/:id', authMiddleware, authorize('ADMIN'), updateProduct);
productRouter.delete('/', authMiddleware, authorize('ADMIN'), deleteProduct);

module.exports = productRouter;
