const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const winston = require('winston');
const chalk = require('chalk');
const authRouter = require('./routes/auth.router');
const errHandler = require('./middlewares/errorhandler');
const connectDB = require('./configs/db');
const envVars = require('./configs/env');
const logger = require('./middlewares/logger');
const uploadRouter = require('./routes/upload.router');
const shoperz = express();

connectDB();
const corsOptions = {
  origin: '*',
};

// MIDDLEWARES
shoperz.use(helmet());
shoperz.use(winston.Logger);
shoperz.use(express.urlencoded({ extended: true }));
shoperz.use(express.json());
shoperz.use(cors(corsOptions));
// ROUTES
shoperz.use('/auth', authRouter);
shoperz.use('/upload', uploadRouter);

// ERROR HANDLER
shoperz.use(errHandler);

// START SERVER ON PORT
const PORT = process.env.PORT || 4000;
logger.debug(envVars); // debug if set NODE_ENV works

shoperz.listen(PORT, () => {
  console.log(
    chalk.blueBright(`
                                
  .oPYo.  o    o .oPYo.  .oPYo. .oPYo.  .oPYo. oooooo 
  8       8    8 8    8  8    8 8.      8   \`8     d' 
  \`Yooo. o8oooo8 8    8 o8YooP' \`boo   o8YooP'    d'  
      \`8  8    8 8    8  8      .P      8   \`b   d'   
       8  8    8 8    8  8      8       8    8  d'    
  \`YooP'  8    8 \`YooP'  8      \`YooP'  8    8 dooooo 
                
`)
  );
});
