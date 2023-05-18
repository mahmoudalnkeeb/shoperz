const authMiddleware = require('../middlewares/authentication');
const authorize = require('../middlewares/authorization');
const orderRouter = require('express').Router();

// create order from cart => empty user cart on confirm => make checkout
// get orders [dashboard]

orderRouter.get('/', authMiddleware, authorize('ADMIN'));
orderRouter.post('/', authMiddleware);

module.exports = orderRouter;
