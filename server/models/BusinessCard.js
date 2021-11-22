const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let BusinessCardModel = {};

const convertID = mongoose.Types.ObjectId;
const setString = (string) => _.escape(string).trim();

const BusinessCardSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    set: setString,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    set: setString,
  },
  email: {
    type: String,
    required: false,
    trim: true,
    set: setString,
  },
  phone: {
    type: String,
    required: false,
    trim: true,
    set: setString,
  },
  title: {
    type: String,
    required: false,
    trim: true,
    set: setString,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    set: setString,
  },
  links: {
    type: [String],
    required: false,
    trim: true,
    set: setString,
  },
  qrcode: {
    type: String,
    required: false,
    trim: true,
    set: setString,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
});

BusinessCardSchema.statics.toAPI = (doc) => ({
  _id: convertID(doc.ObjectId),
  firstName: doc.firstName,
  lastName: doc.lastName,
  email: doc.email,
  phone: doc.phone,
  title: doc.title,
  description: doc.description,
  links: doc.links,
  qrcode: doc.qrcode,
});

BusinessCardSchema.statics.findQRCode = (ownerId, callback) => {
  const search = {
    owner: convertID(ownerId),
  };

  return BusinessCardModel.find(search).select('qrcode createDate').lean().exec(callback);
};

BusinessCardSchema.statics.findBusinessCard = (cardId, callback) => {
  const search = {
    _id: convertID(cardId),
  };

  return BusinessCardModel.find(search).select('name email phone title description links').lean().exec(callback);
};

BusinessCardSchema.statics.findLastAdded = (callback) => {
  
  return BusinessCardModel.find({}).limit(1).sort({$natural:-1}).select('qrcode').lean().exec(callback);
};

BusinessCardModel = mongoose.model('BusinessCard', BusinessCardSchema);

module.exports.BusinessCardModel = BusinessCardModel;
module.exports.BusinessCardSchema = BusinessCardSchema;
