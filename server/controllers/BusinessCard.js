const QRCode = require('qrcode');
const models = require('../models');

const { BusinessCard } = models;

const mainPage = (req, res) => {
  BusinessCard.BusinessCardModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    console.log('redering app page');
    console.log(docs);
    return res.render('app');
  });
};
const makerPage = (req, res) => res.render('createForm', { csrfToken: req.csrfToken() });
const editPage = (req, res) => {
  console.log(`item: ${req.query.cardId}`);
  return res.render('createForm', { csrfToken: req.csrfToken(), cardId: req.query.cardId });
};

const generateQR = (request, response, urlString, _businessCard) => {
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
    _businessCard.qrcode = url;
    const promise = _businessCard.save();
    promise.then(() => {
      res.status(201).json({ imageSrc: url });
    });
    promise.catch((err) => {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};
// call from different page
const makeBusinessCard = (req, res) => {
  if (!req.body.firstName || !req.body.lastName || !req.body.description) {
    return res.status(400).json({ error: 'Both first & last name and description are required' });
  }
  console.log(req.session.account);

  const businessCardData = {
    firstName: doc.firstName,
    lastName: doc.lastName,
    email: req.body.email,
    phone: req.body.phone,
    title: req.body.title,
    description: req.body.description,
    links: req.body.links,
    qrcode: null,
    owner: req.session.account._id,
  };

  const newBusinessCard = new BusinessCard.BusinessCardModel(businessCardData);

  const businessCardPromise = newBusinessCard.save();

  // redirect after make
  businessCardPromise.then(() => {
    // generate qrcode
    const ObjectId = BusinessCard.BusinessCardModel.toAPI(newBusinessCard)._id;
    console.log(ObjectId);
    generateQR(req, res, `${req.headers.host}/cardPage?id=${ObjectId}`, newBusinessCard);
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

    return res.json({ businessCard: docs });
  });
};

module.exports.makeBusinessCard = makeBusinessCard;
module.exports.getBusinessCard = getBusinessCard;
module.exports.getQRCodes = getQRCodes;
module.exports.mainPage = mainPage;
module.exports.makerPage = makerPage;
module.exports.editPage = editPage;
// start server to make sure it work step 17
