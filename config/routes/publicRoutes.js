const publicRoutes = {
  'GET /ping': 'CommonController.ping',
  'POST /register': 'UserController.register',
  'POST /login': 'UserController.login',
  'POST /validate': 'CommonController.validate',
  'POST /create-book': 'BookController.createBook',
  'POST /create-book-instance': 'BookInstanceController.createBookInstance',
  'GET /books': 'BookController.getBooks',
  'GET /books/:id': 'BookController.getBook',
  'DELETE /book/:id' : 'BookController.deleteBook',
  'DELETE /book/:id/instance' : 'BookInstanceController.deleteBookInstance'
};

module.exports = publicRoutes;
