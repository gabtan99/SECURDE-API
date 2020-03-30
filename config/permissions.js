const permissions = {
  STUDENT: ['PATCH /reset-password', 'GET /review', 'POST /review', 'GET /borrow', 'POST /borrow'],
  TEACHER: ['PATCH /reset-password', 'GET /review', 'POST /review', 'GET /borrow', 'POST /borrow'],
  MANAGER: ['PATCH /reset-password', 'POST /book', 'DELETE /book', 'PATCH /book'],
  ADMIN: ['PATCH /reset-password', 'POST /register-manager', 'GET /users', 'GET /logs'],
};

module.exports = permissions;
