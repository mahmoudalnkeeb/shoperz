const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/auth.router');
const errHandler = require('./middlewares/errorhandler');
const connectDB = require('./configs/db');
const envVars = require('./configs/env');
const logger = require('./middlewares/logger');
const shoperz = express();

connectDB();

const corsOptions = {
  origin: '*',
};

// MIDDLEWARES
shoperz.use(express.urlencoded({ extended: true }));
shoperz.use(express.json());
shoperz.use(cors(corsOptions));
// ROUTES
shoperz.use('/auth', authRouter);

// ERROR HANDLER
shoperz.use(errHandler);

// START SERVER ON PORT
const PORT = process.env.PORT || 4000;
logger.debug(envVars); // debug if set NODE_ENV works

shoperz.listen(PORT, () => {
  logger.info('shoperz api running on port ' + PORT);
});
