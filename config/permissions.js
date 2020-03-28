const permissions = {
  STUDENT: ['PATCH /reset-password', 'POST /review', 'POST /borrow'],
  TEACHER: ['PATCH /reset-password', 'POST /review', 'POST /borrow'],
  MANAGER: ['PATCH /reset-password', 'POST /book', 'DELETE /book', 'PATCH /book'],
  ADMIN: ['PATCH /reset-password', 'POST /register-manager', 'GET /system-logs', 'GET /users'],
};

module.exports = permissions;
