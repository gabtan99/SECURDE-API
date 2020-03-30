const privateRoutes = {
  'GET /users': 'UserController.getUsers',
  'GET /users/:role': 'UserController.getUsers',

  'POST /register-manager': 'UserController.registerManager',
  'PATCH /reset-password': 'UserController.resetPassword',

  'POST /book': 'BookController.createBook',
  'PATCH /book/:id': 'BookController.updateBook',
  'DELETE /book/:id': 'BookController.deleteBook',

  'POST /book/:book_id/instance': 'BookInstanceController.createBookInstance',
  'PATCH /book/:book_id/instance/:id': 'BookInstanceController.updateBookInstance',
  'DELETE /book/:book_id/instance/:id': 'BookInstanceController.deleteBookInstance',

  'GET /review': 'BookReviewController.getUserReviews',
  'POST /review/:book_id': 'BookReviewController.createBookReview',

  'GET /borrow': 'BorrowedBookController.getUserBorrowHistory',
  'POST /borrow/:book_instance_id': 'BorrowedBookController.borrowBook',

  'GET /logs': 'CommonController.getSystemLogs',
};

module.exports = privateRoutes;
