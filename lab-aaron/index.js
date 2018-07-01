'use strict';

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRouter = require('./route/auth-router');
const websiteRouter = require('./route/website-router');

mongoose.connect(process.env.MONGODB_URI);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api', authRouter);
app.use('/api', websiteRouter);

app.get('*', function (request, response) {
  reponse.status(404);
  response.send('NOT FOUND');
});

app.listen(PORT, () => {
  console.log(`Listening on PORT: ${PORT}`);
});