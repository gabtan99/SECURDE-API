const { calculateLimitAndOffset, paginate } = require('paginate-info');
const moment = require('moment');
const BorrowedBook = require('../models/BorrowedBook');
const BookInstance = require('../models/BookInstance');
const Book = require('../models/Book');
const { orderBy, between } = require('../services/query.service');
const logAction = require('../services/logger.service');

const LOG_TYPE = 'BOOK';

const BorrowedBookController = () => {
  /**
   * @api {post} /private/borrow/{book_instance_id} Borrow Book
   * @apiName borrowBook
   * @apiGroup Book
   *
   * @apiParam {Number} book_instance_id Book Instance ID.
   *
   * @apiSuccess {String} Success message.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "msg": "SUCCESS"
   *     }
   *
   * @apiError Unavailable Book Instance is already reserved.
   *
   */
  const borrowBook = async (req, res) => {
    const { book_instance_id } = req.params;
    const user_id = req.token.id_number;

    try {
      await BookInstance.findOne({
        where: { id: book_instance_id },
      })
        .then(async bookInstance => {
          if (bookInstance.status !== 'AVAILABLE') {
            return res.status(400).json({
              err: {
                name: 'Unavailable',
                msg: 'Book Instance is already reserved.',
              },
            });
          }
          bookInstance.update({ status: 'RESERVED' });

          const borrowedBook = await BorrowedBook.create({
            book_instance_id,
            user_id,
          });

          await logAction({
            user_id,
            type: LOG_TYPE,
            action: 'Borrowed',
            description: `Borrowed Book Instance ${borrowedBook.book_instance_id} `,
          });
        })
        .catch(() => {
          return res.status(404).json({
            err: {
              name: 'BookInstanceNotFound',
              msg: 'Book Instance does not exist.',
            },
          });
        });

      return res.status(200).json({ msg: 'SUCCESS' });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  /**
   * @api {get} /private/borrow Get User Borrow History
   * @apiName borrowHistory
   * @apiGroup Book
   *
   * @apiParam {Number} [currentPage] Desired Page.
   * @apiParam {Number} [pageSize] Number of elements per page.
   * @apiParam {String} [dateFrom] Start borrow date filter (valid moment js format).
   * @apiParam {String} [dateTo] End borrow date filter (valid moment js format).
   * @apiParam {String} [sort] Sort by conditions (semi-colon separated).
   * @apiParamExample   Request-Example:
   *     {
   *      "currentPage": 1,
   *      "pageSize": 2,
   *      "dateFrom": "2020-03-30",
   *      "dateTo": "2020-03-31",
   *      "sort": "id:asc"
   *      }
   *
   * @apiSuccess {Object} List of user borrow history.
   * @apiSuccess {Object} meta Metadata for pagination.
   *
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "history": "[]",
   *       "meta": {}
   *     }
   *
   *
   */
  const getUserBorrowHistory = async (req, res) => {
    const { currentPage, pageSize = 10, dateFrom, dateTo, sort } = req.query;
    const { limit, offset } = calculateLimitAndOffset(currentPage, pageSize);
    const { id_number } = req.token;
    let options = { where: { user_id: id_number }, order: [] };

    if (dateFrom && dateTo)
      options.where.borrow_date = between(moment().format(dateFrom), moment().format(dateTo));

    if (sort) options.order = orderBy(sort);

    try {
      const { rows, count } = await BorrowedBook.findAndCountAll({
        limit,
        offset,
        ...options,
        attributes: ['id', 'borrow_date', 'return_date'],
        include: [
          {
            model: BookInstance,
            attributes: ['id', 'language'],
            include: [
              {
                model: Book,
                attributes: ['id', 'title', 'authors'],
              },
            ],
          },
        ],
      });

      const meta = paginate(currentPage, count, rows, pageSize);

      return res.status(200).json({ history: rows, meta });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: err.name });
    }
  };

  return {
    borrowBook,
    getUserBorrowHistory,
  };
};

module.exports = BorrowedBookController;
