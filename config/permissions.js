const permissions = {
  STUDENT: ['POST /borrow-book', 'POST /review-book', 'GET /books'],
  TEACHER: ['POST /borrow-book', 'POST /review-book'],
  MANAGER: ['POST /book', 'PUT /book', 'DELETE /book'],
  ADMIN: ['POST /register-manager', 'GET /system-logs', 'GET /users', 'POST /book', 'DELETE /book'],
};

module.exports = permissions;
