const stripe = require('stripe');
const { stripeSecretKey } = require('../configs/env');
const StripeGateway = require('../classes/gateways/StripeGateway');

// should return - transaction_id in case of success or error in case of payment failed

async function payWithStripe(amount, orderId) {
  let stripeGateway = new StripeGateway({ stripeSecretKey }, stripe);
  stripeGateway.initialize();
  let intent = await stripeGateway.createPaymentIntent(amount, 'payment for order ' + orderId);
  console.log(intent);
}

async function payWithStripeConfirm(paymentId, paymentMethodId) {
  let stripeGateway = new StripeGateway({ stripeSecretKey }, stripe);
  stripeGateway.initialize();
  let intent = await stripeGateway.confirmPayment(paymentId, paymentMethodId);
  console.log(intent);
}
/*

Just for testing
async function createPayment(methodDetails) {
  let stripeGateway = new StripeGateway({ stripeSecretKey }, stripe);
  stripeGateway.initialize();
  let method = await stripeGateway.createPaymentMethod(methodDetails);
  console.log(method);
}
*/

// [TODO: implement pay with paypal]
function payWithPaypal(amount, orderId) {}

// delivery boy method
function cashOnDelivery(amount, orderId) {}

module.exports = { payWithStripe, payWithStripeConfirm };
