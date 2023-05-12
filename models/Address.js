const mongoose = require('mongoose');

class AddressClass {
  getFullAddress() {
    return `${this.country},${this.province} , ${this.city} , ${
      this.additionalLandmarks ? this.additionalLandmarks : 'N/A'
    } , ${this.street} , ${this.postalCode}`;
  }
}

const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    additionalLandmarks: {
      type: String,
    },
    postalCode: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

addressSchema.loadClass(AddressClass);
const Address = mongoose.model('Address', addressSchema);

module.exports = Address;