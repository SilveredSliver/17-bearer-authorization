'use strict';

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

const Schema = mongoose.Schema;
const websiteSchema = Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  company: {
    type: String,
    required: true,
  },
});

const Website = mongoose.model('Website', websiteSchema);

module.exports = Website;