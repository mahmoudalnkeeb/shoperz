require('dotenv').config();
const environment = process.env.NODE_ENV;

let envVars = {
  jwtSecret: process.env.JWT_SECRET,
  slatRounds: +process.env.SALT_ROUNDS,
  apiUrl: process.env.API_URL,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
};

if (environment == 'development') {
  envVars = {
    ...envVars,
    dbURI: process.env.URI_DEV,
    dbName: process.env.DB_NAME_DEV,
    mailHost: process.env.MAIL_HOST_DEV,
    mailPort: process.env.MAIL_PORT_DEV,
    mailUser: process.env.MAIL_USER_DEV,
    mailPass: process.env.MAIL_PASS_DEV,
  };
} else {
  envVars = {
    ...envVars,
    dbURI: process.env.URI,
    dbName: process.env.DB_NAME,
    mailHost: process.env.MAIL_HOST,
    mailPort: process.env.MAIL_PORT,
    mailUser: process.env.MAIL_USER,
    mailPass: process.env.MAIL_PASS,
  };
}

module.exports = envVars;
