const privateRoutes = {
  'GET /users': 'UserController.getUsers',
  'GET /users/:role': 'UserController.getUsersWithRole',
  'POST /create-book': 'BookController.createBook',
  'DELETE /book/:id': 'BookController.deleteBook',
  'POST /create-book-instance': 'BookInstanceController.createBookInstance',
  'DELETE /book/:id/instance': 'BookInstanceController.deleteBookInstance',
};

module.exports = privateRoutes;
