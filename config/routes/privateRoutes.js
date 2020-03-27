const privateRoutes = {
  'GET /users': 'UserController.getUsers',
  'GET /users/:role': 'UserController.getUsers',

  'POST /register-manager': 'UserController.registerManager',
  'PATCH /reset-password': 'UserController.resetPassword',

  'POST /book': 'BookController.createBook',
  'DELETE /book/:id': 'BookController.deleteBook',

  'POST /book/:book_id/instance': 'BookInstanceController.createBookInstance',
  'DELETE /book/:book_id/instance/:id': 'BookInstanceController.deleteBookInstance',

  'POST /review/:book_id': 'BookReviewController.createBookReview',
};

module.exports = privateRoutes;
