'use strict';

const express = require('express');
// const bcrypt = require('bcrypt');
const User = require('../model/user');
const jwt = require('jsonwebtoken');
const authRouter = express.Router();

authRouter.route('/signup')
  .get((request, response) => {
    User.find()
      .then((user) => {
        response.status(200).json(user);
      })
      .catch((error) => {
        response.sendStatus(400).send(error);
      });
  })
  .post((request, response) => {
    new User(request.body)
      .save()
      .then((users) => {
        console.log('user: ', users);
        response.status(200).json(users);
      })
      .catch((error) => {
        response.status(400).send(error.message);
      });
  });

authRouter.route('/signup')
  .get((request, response) => {
    let authHeader = request.get('Authorization');
    console.log('header: ', authHeader);
    if (!authHeader) {
      response.status(401);
      response.send('Username / Password required.');
      return;
    }
    let payload = authHeader.split('Basic')[1];
    let decoded = Buffer.from(payload, 'base64').toString();
    let [username, password] = decoded.split(':');
    console.log('Username / Password: ', username, password);

    User.findOne({
      username: username,
    })
      .then((user) => {
        if (user === null) {
          response.send('User Not Found.');
        }
        user.checkPassword(password)
          .then((isValidPassword) => {
            let payload = {userId: user._id};
            let token = jwt.sign(payload, process.env.SECRET);
            response.send(token);
          })
          .catch((error) => {
            response.send('ERROR(/route/auth-router{line-59}):', error);
          });
      });
  });

module.exports = authRouter;