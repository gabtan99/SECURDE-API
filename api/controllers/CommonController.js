const authService = require('../services/auth.service');
const Log = require('../models/Log');

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

  const getSystemLogs = async (req, res) => {
    try {
      const logs = await Log.findAll();

      return res.status(200).json({ logs });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: err.name });
    }
  };

  return {
    ping,
    validate,
    getSystemLogs,
  };
};

module.exports = CommonController;
