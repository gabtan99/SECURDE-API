const publicRoutes = {
  'POST /register': 'UserController.register',
  'POST /login': 'UserController.login',
  'POST /validate': 'UserController.validate',
  'GET /ping': 'CommonController.ping',
};

module.exports = publicRoutes;
