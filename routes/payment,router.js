const { stripePublisableKey } = require('../configs/env');
const Responser = require('../utils/responser');

const paymentRouter = require('express').Router();

paymentRouter.get('/pk', (req, res) => {
  let responser = new Responser(200, 'publishable key sent', {
    publishableKey: stripePublisableKey,
  });
  return responser.respond(res);
});

module.exports = paymentRouter;
