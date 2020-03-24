const publicRoutes = {
  'GET /ping': 'CommonController.ping',
  'POST /register': 'UserController.register',
  'POST /login': 'UserController.login',
  'POST /validate': 'CommonController.validate',
  'GET /books': 'BookController.getBooks',
  'GET /books/:id': 'BookController.getBook',
};

module.exports = publicRoutes;
