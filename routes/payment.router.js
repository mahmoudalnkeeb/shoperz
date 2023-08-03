// const { createIntent } = require('../controllers/payment.controller');
// const authMiddleware = require('../middlewares/authentication');
// const authorize = require('../middlewares/authorization');

const paymentRouter = require('express').Router();

// paymentRouter.post('/create-payment-intent', authMiddleware, authorize('USER'), createIntent);

module.exports = paymentRouter;
