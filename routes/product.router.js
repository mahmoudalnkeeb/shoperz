const { getProducts, getProductById, createProduct, createProducts, updateProduct, deleteProduct } = require('../controllers/product.controller');

const productRouter = require('express').Router();

productRouter.get('/', getProducts);
productRouter.get('/:id', getProductById);
productRouter.post('/', createProduct);
productRouter.post('/multi', createProducts);
productRouter.put('/:id', updateProduct);
productRouter.delete('/', deleteProduct);

module.exports = productRouter;
