const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
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
  emailVerfied: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(+process.env.SALT_ROUNDS, (err, salt) => {
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

userSchema.methods.comparePassword = function (password, callback) {
  let user = this;
  bcrypt.compare(password, user.password, (err, isMatch) => {
    if (err) {
      return callback(err);
    }
    console.log(password, user.password);
    callback(null, isMatch);
  });
};

userSchema.methods.createToken = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
