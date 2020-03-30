const { calculateLimitAndOffset, paginate } = require('paginate-info');
const { Op } = require('sequelize');
const moment = require('moment');
const authService = require('../services/auth.service');
const Log = require('../models/Log');
const User = require('../models/User');

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

  /**
   * @api {post} /private/logs Get Activity Logs
   * @apiName getLogs
   * @apiGroup Activity Logs
   *
   *
   * @apiSuccess {Object[]} logs List of activities.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "logs": []
   *     }
   *
   *
   */
  const getActivityLogs = async (req, res) => {
    const { currentPage, pageSize, dateFrom, dateTo } = req.body;
    const { limit, offset } = calculateLimitAndOffset(currentPage, pageSize);
    let options = { where: {} };

    if (dateFrom && dateTo)
      options.where.date_time = {
        [Op.between]: [moment().format(dateFrom), moment().format(dateTo)],
      };

    try {
      const { rows, count } = await Log.findAndCountAll({
        limit,
        offset,
        ...options,
        order: [['date_time', 'DESC']],
        include: [
          {
            model: User,
            attributes: ['id_number', 'name', 'username', 'email_address', 'access'],
          },
        ],
      });

      const meta = paginate(currentPage, count, rows, pageSize);

      return res.status(200).json({ logs: rows, meta });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: err.name });
    }
  };

  return {
    ping,
    validate,
    getActivityLogs,
  };
};

module.exports = CommonController;
