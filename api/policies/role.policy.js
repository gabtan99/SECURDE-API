const permissions = require('../../config/permissions');

const verifyPermission = (route, method, role) => {
  const target = `${method} ${route}`;
  const accessible = permissions[role];

  const [found] = accessible.filter(item => item.startsWith(target));

  if (found) {
    return true;
  }

  return false;
};

module.exports = (req, res, next) => {
  const { url, method, token } = req;
  const route = url.replace('/private', '');
  const hasAccess = verifyPermission(route, method, token.access);

  if (hasAccess) {
    return next();
  }

  return res.status(401).json({ msg: 'You are not authorized to do that.' });
};
