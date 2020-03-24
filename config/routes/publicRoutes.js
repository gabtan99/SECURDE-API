const publicRoutes = {
  'POST /register': 'UserController.register',
  'POST /login': 'UserController.login',
  'POST /validate': 'UserController.validate',
  'POST /create-book': 'BookController.createBook',
  'GET /ping': 'CommonController.ping',
  'GET /books': 'BookController.getBooks',
};

module.exports = publicRoutes;
