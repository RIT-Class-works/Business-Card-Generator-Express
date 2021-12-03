const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let BusinessCardModel = {};

const convertID = mongoose.Types.ObjectId;
const setString = (string) => _.escape(string).trim();

const BusinessCardSchema = new mongoose.Schema({
  cardName:{
    type: String,
    required: true,
    trim: true,
    set: setString,
  },
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
  _id: doc._id,
  cardName: doc.cardName,
  qrcode: doc.qrcode,
  firstName: doc.firstName,
  lastName: doc.lastName,
  email: doc.email,
  phone: doc.phone,
  title: doc.title,
  description: doc.description,
  links: doc.links,
});

BusinessCardSchema.statics.findQRCode = (ownerId, callback) => {
  const search = {
    owner: convertID(ownerId),
  };

  return BusinessCardModel.find(search).select('qrcode cardName ObjectId').lean().exec(callback);
};

BusinessCardSchema.statics.findBusinessCard = (cardId, callback) => {
  const search = {
    _id: convertID(cardId),
  };

  return BusinessCardModel.findOne(search).select('ObjectId cardName firstName lastName email phone title description links').lean().exec(callback);
};

BusinessCardSchema.statics.update = (cardId, json, callback) => {
  const search = {
    _id: convertID(cardId),
  };

  console.log("id search:" + search);

  return BusinessCardModel.findByIdAndUpdate(search, json, {upsert: false, new: true}).exec(callback);
};

BusinessCardSchema.statics.delete = (cardId, callback) => {
  const search = {
    _id: convertID(cardId),
  };

  return BusinessCardModel.deleteOne(search).exec(callback);
};

BusinessCardSchema.statics.findLastAdded = (callback) => BusinessCardModel.find({}).limit(1).sort({ $natural: -1 }).select('ObjectId qrcode')
  .lean()
  .exec(callback);

BusinessCardModel = mongoose.model('BusinessCard', BusinessCardSchema);

module.exports.BusinessCardModel = BusinessCardModel;
module.exports.BusinessCardSchema = BusinessCardSchema;
