class PaymentGateway {
  constructor(config) {
    this.config = config;
  }

  initialize() {
    throw new Error('Method not implemented');
  }

  createPaymentIntent(amount, currency) {
    throw new Error('Method not implemented');
  }
}

module.exports = PaymentGateway;
