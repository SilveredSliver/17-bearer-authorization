'use strict';

const mongoose = require('mongoose');
const bcrypt  = require('bcrypt');
const jwt = require('jsonwebtoken');

mongoose.connect(process.env.MONGODB_URI);

const Schema = mongoose.Schema;

const userSchema = Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', userSchema);

userSchema.pre('save', function(next) {
  let user = this;
  if (user.isNew) {
    bcrypt.hash(user.password, 10, (error, hash) => {
      if (error) {
        return next(error);
      }
      user.password = hash;
      user.paddwordHash = hash;
      next();
    });
  } else {
    console.log('is not a new user');
    next();
  }
});

userSchema.methods.checkPassword = function(password) {
  let user = this;
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, user.password, (error, validPassword) => {
      if (error) {
        reject(error);
      }
      if (!validPassword) {
        reject(error);
      }
      let payload = {userId: user.id};
      let token = jwt.sign(payload, process.env.SECRET);
      resolve(token);
    });
  });
};

module.exports = User;