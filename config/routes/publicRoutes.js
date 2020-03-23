const publicRoutes = {
  'GET /ping': 'CommonController.ping',
  'POST /register': 'UserController.register',
  'POST /login': 'UserController.login',
  'POST /validate': 'UserController.validate',
  'GET /books': 'BookController.getBooks',
};

module.exports = publicRoutes;
