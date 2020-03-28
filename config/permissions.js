const permissions = {
  STUDENT: [
    'PATCH /reset-password',
    'GET /review',
    'POST /review',
    'GET /borrow',
    'POST /borrow',
    'GET /history',
  ],
  TEACHER: [
    'PATCH /reset-password',
    'GET /review',
    'POST /review',
    'GET /borrow',
    'POST /borrow',
    'GET /history',
  ],
  MANAGER: ['PATCH /reset-password', 'POST /book', 'DELETE /book', 'PATCH /book'],
  ADMIN: ['PATCH /reset-password', 'POST /register-manager', 'GET /system-logs', 'GET /users'],
};

module.exports = permissions;
