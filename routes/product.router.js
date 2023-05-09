const productRouter = require('express').Router();

productRouter.get('/');
productRouter.get('/:id');
productRouter.post('/');
productRouter.put('/:id');
productRouter.delete('/');

module.exports = productRouter;
