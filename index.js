const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const fs = require('fs');
const authRouter = require('./routes/auth.router');
const { errHandler, NotFoundError } = require('./middlewares/errorhandler');
const connectDB = require('./configs/db');
const uploadRouter = require('./routes/upload.router');
const categoryRouter = require('./routes/category.router');
const productRouter = require('./routes/product.router');
const cartRouter = require('./routes/cart.router');
const userRouter = require('./routes/user.router');
const wishlistRouter = require('./routes/wishlist.router');
const addressRouter = require('./routes/address.router');
require('dotenv').config();
const shoperz = express();
const corsOptions = {
  origin: process.env.origin || '*',
  credentials: true,
};

connectDB();

// MIDDLEWARES
shoperz.use(express.urlencoded({ extended: true }));
shoperz.use(express.json());
shoperz.use(cors(corsOptions));
shoperz.use(helmet());
if (process.env.NODE_ENV == 'development') {
  const rfsStream = rfs.createStream('./logs/requests.log', {
    size: '10M',
    interval: '1d',
    compress: 'gzip',
  });
  shoperz.use(morgan('dev', { stream: rfsStream }));
} else shoperz.use(morgan('common'));
// ROUTES
shoperz.get('/', (req, res) => {
  res.send({ message: 'Welcome back to Shoperz e-commerce API We wish you a happy day .ن' });
});
shoperz.use('/auth', authRouter);
shoperz.use('/upload', uploadRouter);
shoperz.use('/categories', categoryRouter);
shoperz.use('/products', productRouter);
shoperz.use('/cart', cartRouter);
shoperz.use('/users', userRouter);
shoperz.use('/wishlist', wishlistRouter);
shoperz.use('/address', addressRouter);

// ERROR HANDLING
shoperz.use('*', (req, res, next) => next(new NotFoundError('this path not found')));
shoperz.use(errHandler);

// START SERVER ON PORT
const PORT = process.env.PORT || 5000;

shoperz.listen(PORT, () => {
  console.log(`API NOW IS RUNNING ON PORT ==> ${PORT} `);
});
