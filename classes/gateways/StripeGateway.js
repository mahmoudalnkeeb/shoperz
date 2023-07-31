const stripe = require('stripe');
const PaymentGateway = require('./PaymentGateway');

class StripeGateway extends PaymentGateway {
  /**
   *
   * @param {*} config
   * @param {stripe} stripe
   */
  constructor(config, stripe) {
    super(config);
    this.stripe = stripe;
  }

  initialize() {
    this.stripeClient = this.stripe(this.config.stripeSecretKey);
  }

  async createPaymentIntent(amount, description, currency = 'EGP') {
    try {
      const paymentIntent = await this.stripeClient.paymentIntents.create({
        amount,
        currency,
        description,
      });

      return paymentIntent;
    } catch (error) {
      throw new Error(`Failed to create payment intent: ${error.message}`);
    }
  }
  async createPaymentMethod(methodDetails) {
    try {
      let paymentMethod = await this.stripeClient.paymentMethods.create(methodDetails);
      return paymentMethod;
    } catch (error) {
      throw new Error(`Failed to confirm payment: ${error.message}`);
    }
  }
  async confirmPayment(paymentId, paymentMethod) {
    try {
      let payment = await this.stripeClient.paymentIntents.confirm(paymentId, {
        payment_method: paymentMethod,
      });
      return payment;
    } catch (error) {
      throw new Error(`Failed to confirm payment: ${error.message}`);
    }
  }
}

module.exports = StripeGateway;
