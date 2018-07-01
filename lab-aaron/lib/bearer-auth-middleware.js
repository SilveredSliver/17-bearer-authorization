'use strict';

const jwt = require('jsonwebtoken');
const User = require('../model/user');

function bearerAuthToken(request, response, next) {
  let authHeader = request.headers.authorization;
  let token = authHeader.split('Bearer ')[1];
  jwt.verify(token, process.env.APP_SECRET, (error, decoded) => {
    if (error) {
      console.log('ERROR(lib/bearer-auth{line 11}): ', error);
      return;
    }
    User.findOne({
      username: decoded.username
    })
      .then((user) => {
        request.user = user;
        next();
      })
      .catch((error) => {
        console.log('ERROR(/lib/bearer-auth{line 22}): ', error);
      });
  });
};

module.exports = bearerAuthToken;