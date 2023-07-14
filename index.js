const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const colors = require('./utils/colors');
const { errHandler, NotFoundError } = require('./middlewares/errorhandler');
const connectDB = require('./configs/db');
const { v1Router } = require('./routes/api.js');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger-def');

require('dotenv').config();
const shoperz = express();
const corsOptions = {
  origin: process.env.origin || '*',
  credentials: true,
};

// MIDDLEWARES
shoperz.use(express.static(__dirname + '/public'));
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
  shoperz.use(morgan('dev'));
} else shoperz.use(morgan('common'));

// swagger ui docs
shoperz.use(
  '/api/v1/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
  })
);
// ROUTES
shoperz.use('/api/v1', v1Router);

// ERROR HANDLING
shoperz.use('*', (req, res, next) => next(new NotFoundError('this path not found')));
shoperz.use(errHandler);

// START SERVER ON PORT
const PORT = process.env.PORT || 5000;

function startServer() {
  shoperz.listen(PORT, () => {
    console.log(colors.info(`API NOW IS RUNNING ON PORT ==> ${PORT}`));
  });
}

connectDB(startServer);
