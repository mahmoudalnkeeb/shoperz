const v1Router = require('express').Router();
const authRouter = require('./auth.router');
const uploadRouter = require('./upload.router');
const categoryRouter = require('./category.router');
const productRouter = require('./product.router');
const cartRouter = require('./cart.router');
const userRouter = require('./user.router');
const wishlistRouter = require('./wishlist.router');
const addressRouter = require('./address.router');
const paymentRouter = require('./payment.router');

// root path v1
v1Router.get('/', (req, res) =>
  res.json({ message: 'Welcome back to Shoperz e-commerce API@V1 We wish you a happy day.' })
);

// api main routes
v1Router.use('/auth', authRouter);
v1Router.use('/upload', uploadRouter);
v1Router.use('/categories', categoryRouter);
v1Router.use('/products', productRouter);
v1Router.use('/cart', cartRouter);
v1Router.use('/users', userRouter);
v1Router.use('/wishlist', wishlistRouter);
v1Router.use('/address', addressRouter);
v1Router.use('/payments', paymentRouter);

module.exports = { v1Router };
