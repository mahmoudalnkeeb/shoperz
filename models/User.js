const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ejs = require('ejs');
const { sendEmail } = require('../configs/nodemailer');
const envVars = require('../configs/env');
const logger = require('../middlewares/logger');
const path = require('path');
const Wishlist = require('./Wishlist');
const { renderTemplate } = require('../utils/utils');

const VERIFY_TEMPLATE = path.resolve(path.join(process.cwd(), './views/verifyEmail.ejs'));
const RESET_TEMPLATE = path.resolve(
  path.join(process.cwd(), './views/resetPassword.ejs')
);

class UserClass {
  async createWishlist() {
    try {
      let wishlist = new Wishlist({ userId: this._id, products: [] });
      let userWishlist = await wishlist.save();
      return userWishlist;
    } catch (error) {
      throw new Error('error in creating user wishlist', error);
    }
  }
  async changePassword(currentPassword, newPassword) {
    try {
      const isMatch = await this.comparePasswordAsync(currentPassword);

      if (!isMatch) {
        throw new Error('Incorrect current password');
      }

      const salt = await bcrypt.genSalt(envVars.slatRounds);
      const hash = await bcrypt.hash(newPassword, salt);

      this.password = hash;
      await this.save();

      return 'Password changed successfully';
    } catch (error) {
      throw new Error('Error while changing password', error);
    }
  }

  comparePassword(password, callback) {
    let user = this;
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return callback(err);
      }
      callback(null, isMatch);
    });
  }

  createToken() {
    return jwt.sign({ userId: this._id }, envVars.jwtSecret);
  }

  async sendVerifyEmail() {
    try {
      let { verifyCode, fullname, email } = this;
      const developmentUrl = `${envVars.apiUrl}:${process.env.PORT}/auth/verify-email`;
      const productionUrl = `${envVars.apiUrl}/auth/verify-email`;
      const verifyUrl =
        process.env.NODE_ENV == 'development'
          ? `${developmentUrl}?token=${verifyCode}`
          : `${productionUrl}?token=${verifyCode}`;
      const html = await renderTemplate(VERIFY_TEMPLATE, {
        verifyUrl,
        name: fullname,
      });
      let mailOptions = {
        from: 'shoperz team',
        to: email,
        subject: 'Shoperz verify your email',
        html: html,
      };
      return await sendEmail(mailOptions);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async sendResetEmail() {
    try {
      let { fullname, email } = this;
      let resetToken = require('crypto').randomBytes(4).toString('hex');
      this.resetToken = resetToken;
      const html = await renderTemplate(RESET_TEMPLATE, {
        resetToken,
        name: fullname,
      });
      let mailOptions = {
        from: 'shoperz team',
        to: email,
        subject: 'Shoperz reset password',
        html: html,
      };
      return await sendEmail(mailOptions);
    } catch (error) {
      throw error;
    }
  }

  // statics

  static async getUserByEmail(email) {
    try {
      let count = await this.count({ email });
      if (!count) return count;
      let user = await this.findOne({ email });
      return user;
    } catch (error) {
      throw new Error('error getting user by email', error);
    }
  }
}

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    verifyCode: {
      type: String,
      required: true,
      unique: true,
      default: require('crypto').randomBytes(4).toString('hex'),
    },
    resetToken: {
      type: String,
      unique: true,
    },
    role: {
      type: String,
      required: true,
      default: 'USER',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(envVars.slatRounds, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

userSchema.loadClass(UserClass);

const User = mongoose.model('User', userSchema);

module.exports = User;
