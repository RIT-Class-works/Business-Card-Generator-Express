const QRCode = require('qrcode');
const models = require('../models');

const { BusinessCard } = models;

let newBusinessCard = null;
let cardId = null

const mainPage = (req, res) => {
  BusinessCard.BusinessCardModel.findQRCode(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    console.log('rendering app page');
    console.log(docs);
    return res.render('app');
  });
};

const makerPage = (req, res) => res.render('createForm', { _cardId: cardId });

const editPage = (req, res) => {
  console.log(`item: ${req.body.cardId}`);
  cardId = req.body.cardId;
  return res.json({ redirect: '/maker' });
};

const generateQR = (req, res, urlString) => {
  console.log(urlString);
  const opts = {
    errorCorrectionLevel: 'H',
    type: 'image/jpeg',
    quality: 0.3,
    margin: 1,
    color: {
      dark: '#010599FF',
      light: '#FFBF60FF',
    },
  };

  QRCode.toDataURL(urlString, opts, (err, url) => {
    if (err) throw err;
    console.log(url);
    newBusinessCard.qrcode = url;
    const promise = newBusinessCard.save();
    promise.then(() => {return res.json({ redirect: '/maker' })});
    promise.catch((promiseError) => {
      console.log(promiseError);
      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};
// call from different page
const makeBusinessCard = (req, res) => {
  console.log(`${req.body.firstname}, ${req.body.lastname}, ${req.body.info}`);
  if (!req.body.firstname || !req.body.lastname || !req.body.info) {
    return res.status(400).json({ error: 'Both first & last name and description are required' });
  }
  console.log(req.session.account);

  const businessCardData = {
    firstName: req.body.firstname,
    lastName: req.body.lastname,
    email: req.body.email,
    phone: req.body.phone,
    title: req.body.title,
    description: req.body.info,
    links: req.body.link,
    qrcode: null,
    owner: req.session.account._id,
  };

  newBusinessCard = new BusinessCard.BusinessCardModel(businessCardData);

  const businessCardPromise = newBusinessCard.save();

  // redirect after make
  businessCardPromise.then(() => {
    // generate qrcode
    const ObjectId = BusinessCard.BusinessCardModel.toAPI(newBusinessCard)._id;
    console.log(ObjectId);
    generateQR(req, res, `${req.headers.host}/cardPage?id=${ObjectId}`);
  });

  businessCardPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'businessCard already exists' });
    }
    return res.status(400).json({ error: 'An error occurred' });
  });

  return businessCardPromise;
};

const getQRCodes = (request, response) => {
  const req = request;
  const res = response;

  return BusinessCard.BusinessCardModel.findQRCode(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ businessCards: docs });
  });
};

const getBusinessCard = (request, response) => {
  const req = request;
  const res = response;

  return BusinessCard.BusinessCardModel.findBusinessCard(req.query.cardId, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    const json = BusinessCard.BusinessCardModel.toAPI(docs);
    return res.json({ businessCard: json });
  });
};

const getLastAdded = (request, response) => {
  const res = response;

  return BusinessCard.BusinessCardModel.findLastAdded((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ businessCard: docs });
  });
};

const cardPage = (request, response) =>{
  const id = request.query.id
  return BusinessCard.BusinessCardModel.findBusinessCard(id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    const object = BusinessCard.BusinessCardModel.toAPI(docs);
    res.render('presentForm', { firstName: object.firstName, lastName: object.lastName, email: object.email, phone: object.phone, title: object.title, info: object.description, links: object.links });
  });
}

module.exports.makeBusinessCard = makeBusinessCard;
module.exports.getLastAdded = getLastAdded;
module.exports.getBusinessCard = getBusinessCard;
module.exports.getQRCodes = getQRCodes;
module.exports.mainPage = mainPage;
module.exports.makerPage = makerPage;
module.exports.editPage = editPage;
module.exports.cardPage = cardPage;
