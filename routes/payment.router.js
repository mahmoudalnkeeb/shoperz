const { getPublisherKey } = require('../controllers/payment.controller');
const authMiddleware = require('../middlewares/authentication');
// const authorize = require('../middlewares/authorization');

const paymentRouter = require('express').Router();

// paymentRouter.post('/create-payment-intent', authMiddleware, authorize('USER'), createIntent);

paymentRouter.get('/pk', authMiddleware, getPublisherKey);

module.exports = paymentRouter;
