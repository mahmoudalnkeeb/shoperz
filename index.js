const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const chalk = require('chalk');
const authRouter = require('./routes/auth.router');
const { errHandler, NotFoundError } = require('./middlewares/errorhandler');
const connectDB = require('./configs/db');
const uploadRouter = require('./routes/upload.router');
const categoryRouter = require('./routes/category.router');
const productRouter = require('./routes/product.router');
require('dotenv').config();
const shoperz = express();
const corsOptions = {
  origin: process.env.origin || '*',
  credentials: true,
};

connectDB();

// MIDDLEWARES
shoperz.use(helmet());
shoperz.use(express.urlencoded({ extended: true }));
shoperz.use(express.json());
shoperz.use(cors(corsOptions));
// ROUTES
shoperz.use('/auth', authRouter);
shoperz.use('/upload', uploadRouter);
shoperz.use('/categories', categoryRouter);
shoperz.use('/products', productRouter);

// ERROR HANDLING
shoperz.use('*', (req, res, next) => next(new NotFoundError('this path not found')));
shoperz.use(errHandler);

// START SERVER ON PORT
const PORT = process.env.PORT || 4000;

shoperz.listen(PORT, () => {
  console.log(
    chalk.blueBright(`
    =.oPYo.  o    o .oPYo.  .oPYo. .oPYo.  .oPYo. oooooo 
    8       8    8 8    8  8    8 8.      8   \`8     d' 
    \`Yooo. o8oooo8 8    8 o8YooP' \`boo   o8YooP'    d'  
        \`8  8    8 8    8  8      .P      8   \`b   d'   
         8  8    8 8    8  8      8       8    8  d'    
    \`YooP' 8    8  \`YooP' 8       \`YooP'  8    8 dooooo |🇪🇬|
`)
  );
});
