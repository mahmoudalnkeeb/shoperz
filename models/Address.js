const mongoose = require('mongoose');

class AddressClass {
  getFullAddress() {
    return `${this.country},${this.province} , ${this.city} , ${
      this.additionalLandmarks ? this.additionalLandmarks : 'N/A'
    } , ${this.street} , ${this.postalCode}`;
  }
  static async resetDefault() {
    await this.updateMany({ defult: true }, { defult: false });
  }
}

const addressSchema = new mongoose.Schema(
  {
    userId: {
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
    default: {
      type: Boolean,
      required: true,
      default: false,
    },
    addressLabel: {
      type: String,
      enums: ['Home', 'Work'],
      required: true,
      default: 'Home',
    },
  },
  { timestamps: true }
);

addressSchema.loadClass(AddressClass);
const Address = mongoose.model('Address', addressSchema);

module.exports = Address;
