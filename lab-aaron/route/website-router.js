'use strict';

const express = require('express');
const Website = require('../model/website');
const bearerAuth = require('../lib/bearer-auth-middleware');
const websiteRouter = express.Router();

websiteRouter.route('/websites')
  .get(bearerAuth, (request, response) => {
    console.log('userId: ', request.user);
    Website.find({userId: request.user})
      .then((websites) => {
        response.status(200).json(websites);
      })
      .catch((error) => {
        response.send('ERROR(/route/website-router{line-16}): ', error);
      });
  })
  .post(bearerAuth, (request, response) => {
    request.body.userId = request.user._id;
    new Website(request.body)
      .save()
      .then((website) => {
        console.log('website: ', website);
        response.status(200).json(website);
      })
      .catch((error) => {
        response.send('ERROR(route/website-router{line-28}): ', error);
      });
  });

websiteRouter.route('/website/:id')
  .get(bearerAuth, (request, response) => {
    if (request.params.id) {
      return Website.findById(request.params.id)
        .then((website) => {
          response.status(200).json(website);
        })
        .catch((error) => {
          response.send('ERROR(route/website-router{line-40}): ', error);
        });
    }
  })
  .put(bearerAuth, (request, response) => {
    let id = request.params.id;
    Website.findByIdAndUpdate(id, request.body, {
      new: true,
    })
      .then((website) => {
        response.status(204).json(website);
      })
      .catch((error) => {
        response.send('ERROR(route/website-router{line-53}): ', error);
      });
  })
  .delete(bearerAuth, (request, response) => {
    Website.findByIdAndRemove(request.params.id)
      .then((website) => {
        if (website.userId.toString() === request.user.id.toString()) {
          return website.remove();
        }
      })
      .then((website) => {
        response.status(200).json(website);
      })
      .catch((error) => {
        response.send('ERROR(route/website-router{line-67}): ', error);
      });
  });

module.exports = websiteRouter;