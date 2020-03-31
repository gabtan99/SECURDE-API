const { calculateLimitAndOffset, paginate } = require('paginate-info');
const moment = require('moment');
const authService = require('../services/auth.service');
const { orderBy, between } = require('../services/query.service');
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
   * @api {get} /private/logs Get Activity Logs
   * @apiName getLogs
   * @apiGroup Activity Logs
   *
   *
   * @apiParam {Number} [currentPage] Desired Page.
   * @apiParam {Number} [pageSize] Number of elements per page.
   * @apiParam {String} [dateFrom] Start date filter (valid moment js format).
   * @apiParam {String} [dateTo] End date filter (valid moment js format).
   * @apiParam {String} [sort] Sort by conditions (semi-colon separated).
   * @apiParamExample {json} Request-Example:
   *     {
   *      "currentPage": 1,
   *      "pageSize": 2,
   *      "dateFrom": "2020-03-30",
   *      "dateTo": "2020-03-31",
   *      "sort": "date_time:asc;id:asc"
   *      }
   *
   * @apiSuccess {Object[]} logs List of activities.
   * @apiSuccess {Object} meta Metadata for pagination.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "logs": [],
   *       "meta": {}
   *     }
   *
   *
   */
  const getActivityLogs = async (req, res) => {
    const { currentPage, pageSize = 10, dateFrom, dateTo, sort } = req.query;
    const { limit, offset } = calculateLimitAndOffset(currentPage, pageSize);
    let options = { where: {}, order: [] };

    if (dateFrom && dateTo)
      options.where.date_time = between(moment().format(dateFrom), moment().format(dateTo));

    if (sort) options.order = orderBy(sort);

    try {
      const { rows, count } = await Log.findAndCountAll({
        limit,
        offset,
        ...options,
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
