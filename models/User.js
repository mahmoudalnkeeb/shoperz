const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const envVars = require('../configs/env');
const path = require('path');
const { renderTemplate } = require('../utils/utils');
const { sendEmail } = require('../configs/nodemailer');
const VERIFY_TEMPLATE = path.resolve(path.join(process.cwd(), './views/verifyEmail.ejs'));
const RESET_TEMPLATE = path.resolve(
  path.join(process.cwd(), './views/resetPassword.ejs')
);

class UserClass {
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

  async resetPassword(newPassword) {
    try {
      this.password = this.hashPass(newPassword);
      await this.save();
      console.log(this.password);
      return 'Password changed successfully';
    } catch (error) {
      throw new Error('Error while changing password', error);
    }
  }

  comparePassword(password) {
    try {
      let user = this;
      return bcrypt.compareSync(password, user.password);
    } catch (error) {
      throw new Error('error in comparing user password', error);
    }
  }

  createToken() {
    try {
      return jwt.sign({ userId: this._id }, envVars.jwtSecret);
    } catch (error) {
      throw new Error('error in signing new token', error);
    }
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
      throw new Error('error sending verify email', error);
    }
  }

  async sendResetEmail() {
    try {
      let { fullname, email } = this;
      let resetToken = require('crypto').randomBytes(4).toString('hex');
      this.resetToken = resetToken;
      await this.save();
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
      throw new Error('error sending reset email', error);
    }
  }

  // utility hash function
  hashPass(password) {
    try {
      let salt = bcrypt.genSaltSync(envVars.slatRounds);
      let hash = bcrypt.hashSync(password, salt);
      return hash;
    } catch (error) {
      throw new Error('error hashing the password', error);
    }
  }
  // statics
  // utility static method for user hashing password
  static hashPassword(password) {
    try {
      return this.hashPassword(password);
    } catch (error) {
      throw new Error('error hashing the password', error);
    }
  }

  static async getUserByEmail(email) {
    try {
      let count = await this.count({ email });
      if (!count) return count;
      let user = await this.findOne({ email });
      return user;
    } catch (error) {
      throw new Error('Error getting user by email', error);
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

userSchema.loadClass(UserClass);

const User = mongoose.model('User', userSchema);

module.exports = User;
