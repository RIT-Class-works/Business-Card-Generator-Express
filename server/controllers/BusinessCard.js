const QRCode = require('qrcode');
const models = require('../models');

const { BusinessCard } = models;

let newBusinessCard = null;
let cardId = null;

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

const makerPage = (req, res) => res.render('createForm');
const editPage = (req, res) => res.render('createForm', { _cardId: cardId });

const editRedirect = (req, res) => {
  console.log(`item: ${req.query.cardId}`);
  cardId = req.query.cardId;
  return res.json({ redirect: '/editing' });
};

const makeEdit = (req, res) => {
  const json = {
    firstName: req.body.firstname,
    lastName: req.body.lastname,
    email: req.body.email,
    phone: req.body.phone,
    title: req.body.title,
    description: req.body.info,
    links: String(req.body.link).split(','),
  };
  console.log(json.links);
  BusinessCard.BusinessCardModel.update(req.body._id, json, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    console.log(docs);
    return res.json({ businessCard: docs });
  });
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
      light: '#F4A698',
    },
  };

  QRCode.toDataURL(urlString, opts, (err, url) => {
    if (err) throw err;
    console.log(url);
    newBusinessCard.qrcode = url;
    const promise = newBusinessCard.save();
    promise.then(() => res.json({ redirect: '/maker' }));
    promise.catch((promiseError) => {
      console.log(promiseError);
      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};
// call from different page
const makeBusinessCard = (req, res) => {
  console.log(`${req.body.firstname}, ${req.body.lastname}, ${req.body.info}`);
  if (!req.body.cardName || !req.body.firstname || !req.body.lastname || !req.body.info) {
    return res.status(400).json({ error: 'Card name, your first & last name ,and description are required' });
  }
  console.log(req.session.account);

  const businessCardData = {
    cardName: req.body.cardName,
    firstName: req.body.firstname,
    lastName: req.body.lastname,
    email: req.body.email,
    phone: req.body.phone,
    title: req.body.title,
    description: req.body.info,
    links: String(req.body.link).split(','),
    qrcode: null,
    owner: req.session.account._id,
  };

  newBusinessCard = new BusinessCard.BusinessCardModel(businessCardData);

  const businessCardPromise = newBusinessCard.save();

  // redirect after make
  businessCardPromise.then(() => {
    // generate qrcode
    const ObjectId = BusinessCard.BusinessCardModel.toAPI(newBusinessCard)._id;
    console.log(newBusinessCard);
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
    console.log(docs);
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
    console.log(docs);
    const json = BusinessCard.BusinessCardModel.toAPI(docs);
    console.log(json);
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
    const json = BusinessCard.BusinessCardModel.toAPI(docs[0]);
    console.log(docs);
    console.log(json);

    return res.json({ businessCard: json });
  });
};

const cardPage = (request, response) => {
  const { id } = request.query;
  BusinessCard.BusinessCardModel.findBusinessCard(id, (err, docs) => {
    if (err) {
      console.log(err);
      response.status(400).json({ error: 'An error occurred' });
    }
    // need to change some of the name to keep character on lin 187 under 100
    const a = {
      _id: docs._id,
      cardName: docs.cardName,
      qrcode: docs.qrcode,
      firstName: docs.firstName,
      lastName: docs.lastName,
      email: docs.email,
      phone: docs.phone,
      title: docs.title,
      info: docs.description,
      links: docs.links,
    };
    response.render('presentForm', {
      fn: a.firstName, ln: a.lastName, e: a.email, p: a.phone, t: a.title, i: a.info, l: a.links,
    });
  });
};

const deleteCard = (request, response) => {
  BusinessCard.BusinessCardModel.delete(request.body.cardId, (err, docs) => {
    if (err) {
      console.log(err);
      return response.status(400).json({ error: 'An error occurred' });
    }
    console.log(docs);
    return response.json({ redirect: '/app' });
  });
};

module.exports.makeBusinessCard = makeBusinessCard;
module.exports.getLastAdded = getLastAdded;
module.exports.getBusinessCard = getBusinessCard;
module.exports.getQRCodes = getQRCodes;
module.exports.mainPage = mainPage;
module.exports.makerPage = makerPage;
module.exports.editPage = editPage;
module.exports.editRedirect = editRedirect;
module.exports.makeEdit = makeEdit;
module.exports.cardPage = cardPage;
module.exports.deleteCard = deleteCard;
