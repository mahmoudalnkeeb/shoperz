const {
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  createCategories,
} = require('../controllers/category.controller');

const categoryRouter = require('express').Router();

categoryRouter.get('/', getAllCategories);
categoryRouter.get('/:id', getCategoryById);
categoryRouter.post('/', createCategory);
categoryRouter.post('/multi', createCategories);
categoryRouter.put('/:id', updateCategory);
categoryRouter.delete('/:id', deleteCategory);

module.exports = categoryRouter;
