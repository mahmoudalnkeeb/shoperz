const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ejs = require('ejs');
const { sendEmail } = require('../configs/nodemailer');
const envVars = require('../configs/env');
const logger = require('../middlewares/logger');
const path = require('path');

class UserClass {
  // utiliy function to check user entered password match the real password
  comparePassword(password, callback) {
    let user = this;
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return callback(err);
      }
      callback(null, isMatch);
    });
  }

  // send email to user email to check ownership

  sendVerifyEmail(cb) {
    const verifyUrl =
      process.env.NODE_ENV == 'development'
        ? `${envVars.apiUrl}:${process.env.PORT}/auth/verify?token=${this.verifyCode}`
        : `${envVars.apiUrl}/auth/verify?token=${this.verifyCode}`;
    console.log(verifyUrl);
    ejs.renderFile(
      path.resolve(path.join(process.cwd(), './views/verifyEmail.ejs')),
      { verifyUrl },
      (err, html) => {
        if (err) logger.error(err);
        let mailOptions = {
          from: 'shoperz team',
          to: this.email,
          subject: 'Shoperz verify your email',
          html: html,
        };
        sendEmail(mailOptions, cb);
      }
    );
  }

  // create user token on login success

  createToken() {
    return jwt.sign({ userId: this._id }, envVars.jwtSecret);
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
