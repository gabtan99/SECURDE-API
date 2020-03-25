const permissions = {
  STUDENT: ['PATCH /reset-password', 'POST /borrow-book', 'POST /review-book', 'GET /books'],
  TEACHER: ['PATCH /reset-password', 'POST /borrow-book', 'POST /review-book'],
  MANAGER: ['PATCH /reset-password', 'POST /book', 'PUT /book', 'DELETE /book'],
  ADMIN: [
    'PATCH /reset-password',
    'POST /register-manager',
    'GET /system-logs',
    'GET /users',
    'POST /book',
    'DELETE /book',
  ],
};

module.exports = permissions;
