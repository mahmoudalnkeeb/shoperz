const {
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  createCategories,
} = require('../controllers/category.controller');
const authMiddleware = require('../middlewares/authentication');
const authorize = require('../middlewares/authorization');

const categoryRouter = require('express').Router();

categoryRouter.get('/', getAllCategories);
categoryRouter.get('/:id', getCategoryById);

// dashboard
categoryRouter.post('/', authMiddleware, authorize('ADMIN'), createCategory);
categoryRouter.post('/multi', authMiddleware, authorize('ADMIN'), createCategories);
categoryRouter.put('/:id', authMiddleware, authorize('ADMIN'), updateCategory);
categoryRouter.delete('/:id', authMiddleware, authorize('ADMIN'), deleteCategory);

module.exports = categoryRouter;
