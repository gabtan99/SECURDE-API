const CommonController = () => {
  const ping = (req, res) => {
    return res.status(200).json({
      msg: 'SUCCESS',
    });
  };

  return {
    ping,
  };
};

module.exports = CommonController;
