const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/app', mid.requiresSecure, mid.requiresLogin, controllers.BusinessCard.mainPage);
  app.get('/getQRCodes', mid.requiresSecure, mid.requiresLogin, controllers.BusinessCard.getQRCodes);
  app.get('/getBusinessCard', mid.requiresSecure, mid.requiresLogin, controllers.BusinessCard.getBusinessCard);
  app.get('/getLastAdded', mid.requiresSecure, mid.requiresLogin, controllers.BusinessCard.getLastAdded);
  app.get('/maker', mid.requiresSecure, mid.requiresLogin, controllers.BusinessCard.makerPage);
  app.post('/maker', mid.requiresSecure, mid.requiresLogin, controllers.BusinessCard.makeBusinessCard);
  app.get('/edit', mid.requiresSecure, mid.requiresLogin, controllers.BusinessCard.editRedirect);
  app.get('/editing', mid.requiresSecure, mid.requiresLogin, controllers.BusinessCard.editPage);
  app.post('/edit', mid.requiresSecure, mid.requiresLogin, controllers.BusinessCard.makeEdit);
  app.post('/delete', mid.requiresSecure, mid.requiresLogin, controllers.BusinessCard.deleteCard);
  app.get('/cardPage', mid.requiresSecure, controllers.BusinessCard.cardPage);
  app.get('*', (req, res) => { res.render('notfound'); });
};

module.exports = router;
