const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/app' });
  });
};

const signup = (req, res) => {
  // cast to string to cover up security flaw
  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
      purchased: false,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/app' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }
      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};
const changePass = (request, response) => {
  const req = request;
  const res = response;
  const oldPass = `${req.body.oldPass}`;
  const newPass = `${req.body.newPass}`;
  const newPass2 = `${req.body.newPass2}`;

  if (!oldPass || !newPass || !newPass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (newPass !== newPass2) {
    return res.status(400).json({ error: 'New Pass and Retype must be mathced' });
  }
  return Account.AccountModel.authenticate(req.session.account.username, oldPass,
    (err, account) => {
      if (err || !account) {
        return res.status(401).json({ error: 'PassWord not matched with account' });
      }

      return Account.AccountModel.generateHash(newPass, (salt, hash) => {
        const json = {
          salt,
          password: hash,
        };

        return Account.AccountModel.changePass(req.session.account._id, json, (err2, docs) => {
          if (err2) {
            return res.status(400).json({ error: 'An error occurred' });
          }
          console.log(docs.password);
          return res.json({ message: 'password successfully changed', redirect: '/app' });
        });
      });
    });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

const makePurchase = (request, response) => {
  const req = request;
  const res = response;
  return Account.AccountModel.makePurchase(req.session.account._id, (err, docs) => {
    if (err) {
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ purchased: docs.purchased });
  });
};
const getPurchased = (request, response) => {
  const req = request;
  const res = response;

  return Account.AccountModel.getPurchased(req.session.account._id, (err, docs) => {
    console.log(req.session.account);
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ account: docs[0] });
  });
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.makePurchase = makePurchase;
module.exports.getPurchased = getPurchased;
module.exports.changePass = changePass;
