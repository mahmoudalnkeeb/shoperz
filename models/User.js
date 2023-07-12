const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const nodemailer = require('nodemailer');
const envVars = require('../configs/env');
const { renderTemplate, hashPassword } = require('../utils/utils');
const MailingService = require('../classes/mailing/MailingService');
const logger = require('../middlewares/logger');
const VERIFY_TEMPLATE = path.resolve(path.join(process.cwd(), './views/verifyEmail.ejs'));
const RESET_TEMPLATE = path.resolve(path.join(process.cwd(), './views/resetPassword.ejs'));

class UserClass {
  constructor() {
    this.gmailService = new MailingService(
      {
        service: 'gmail',
        host: envVars.mailHost,
        port: envVars.mailPort,
        auth: {
          user: envVars.mailUser,
          pass: envVars.mailPass,
        },
      },
      nodemailer,
      logger
    );
  }
  async changePassword(currentPassword, newPassword) {
    try {
      const isMatch = await this.comparePasswordAsync(currentPassword);

      if (!isMatch) {
        throw new Error('Incorrect current password');
      }
      let hash = hashPassword(newPassword);
      this.password = hash;
      await this.save();
      return 'Password changed successfully';
    } catch (error) {
      throw new Error('Error while changing password', error);
    }
  }

  async resetPassword(newPassword) {
    try {
      this.password = hashPassword(newPassword);
      await this.save();
      console.log(this.password);
      return 'Password changed successfully';
    } catch (error) {
      throw new Error('Error while changing password', error);
    }
  }

  async sendVerifyEmail() {
    try {
      let { fullname, email } = this;
      if (this.emailVerify.isVerified) throw new Error('already verified');
      let verifyCode = require('crypto').randomBytes(3).toString('hex');
      let verifyUrl = this.verifyUrl(verifyCode);
      this.emailVerify.code = verifyCode;
      this.emailVerify.codeExpirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await this.save();
      const html = await renderTemplate(VERIFY_TEMPLATE, {
        verifyUrl,
        name: fullname,
      });
      let mailOptions = {
        from: envVars.mailUser,
        to: email,
        subject: 'Shoperz verify your email',
        html: html,
      };

      return await this.gmailService.sendEmail(mailOptions);
    } catch (error) {
      if (error.message == 'already verified') throw error;
      throw new Error('error sending verify email', error);
    }
  }

  async sendResetEmail() {
    try {
      let { fullname, email } = this;
      let resetToken = require('crypto').randomBytes(3).toString('hex');
      this.passwordReset.token = resetToken;
      await this.save();
      const html = await renderTemplate(RESET_TEMPLATE, {
        resetToken,
        name: fullname,
      });
      let mailOptions = {
        from: envVars.mailUser,
        to: email,
        subject: 'Shoperz reset password',
        html: html,
      };
      return await this.gmailService.sendEmail(mailOptions);
    } catch (error) {
      throw new Error('error sending reset email', error);
    }
  }
  validateVerifyCode(code) {
    let isEqual = this.emailVerify.code == code;
    let isExpired = this.emailVerify.codeExpirationDate <= new Date(Date.now());
    if (isEqual && !isExpired) return true;
    return false;
  }

  validateResetToken(token) {
    let isEqual = this.passwordReset.token == token;
    let isExpired = this.passwordReset.codeExpirationDate <= new Date(Date.now());
    if (isEqual && !isExpired) return true;
    return false;
  }

  comparePassword(password) {
    try {
      let user = this;
      return bcrypt.compareSync(password, user.password);
    } catch (error) {
      throw new Error('error in comparing user password', error);
    }
  }

  createNewToken(user_id) {
    const secret = envVars.jwtSecret;
    const payload = {
      userId: this._id || user_id,
    };
    if (!secret) {
      console.error('ERROR !! , Secret key is not exist in env variables ');
      return process.exit(1);
    }
    if (!this._id && !user_id) {
      throw Error(
        `Error , The _id key is not provided , expected ObjectId but got :  ${this._id || user_id}`
      );
    }
    const token = jwt.sign(payload, secret);
    return token;
  }

  // utility create verify url
  verifyUrl(verifyCode) {
    const developmentUrl = `${envVars.apiUrl}:${process.env.PORT}/auth/verify-email`;
    const productionUrl = `${envVars.apiUrl}/auth/verify-email`;
    return process.env.NODE_ENV == 'development'
      ? `${developmentUrl}?token=${verifyCode}&uid=${this._id}`
      : `${productionUrl}?token=${verifyCode}&uid=${this._id}`;
  }

  // statics

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
    emailVerify: {
      code: {
        type: String,
      },
      isVerified: {
        type: Boolean,
        required: true,
        default: false,
      },
      codeExpirationDate: {
        type: Date,
      },
    },
    passwordReset: {
      token: {
        type: String,
      },
      tokenExpirationDate: {
        type: Date,
      },
    },
    role: {
      type: String,
      required: true,
      default: 'USER',
    },
    userToken: {
      token: {
        type: String,
      },
      tokenEXP: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.loadClass(UserClass);

const User = mongoose.model('User', userSchema);

module.exports = User;
