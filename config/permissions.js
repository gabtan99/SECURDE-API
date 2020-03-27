const permissions = {
  STUDENT: [
    'PATCH /reset-password',
    'POST /borrow-book',
    'POST /review-book',
    'GET /books',
    'POST /review',
  ],
  TEACHER: ['PATCH /reset-password', 'POST /borrow-book', 'POST /review-book', 'POST /review'],
  MANAGER: ['PATCH /reset-password', 'POST /book', 'PUT /book', 'DELETE /book', 'PATCH /book'],
  ADMIN: ['PATCH /reset-password', 'POST /register-manager', 'GET /system-logs', 'GET /users'],
};

module.exports = permissions;
