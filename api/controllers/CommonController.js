const authService = require('../services/auth.service');

const CommonController = () => {
  const ping = (req, res) => {
    return res.status(200).json({
      msg: 'SUCCESS',
    });
  };

  const validate = (req, res) => {
    const { token } = req.body;

    authService().verify(token, err => {
      if (err) {
        return res.status(401).json({ isvalid: false, err: 'Invalid Token!' });
      }

      return res.status(200).json({ isvalid: true });
    });
  };

  return {
    ping,
    validate,
  };
};

module.exports = CommonController;
