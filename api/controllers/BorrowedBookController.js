const BorrowedBook = require('../models/BorrowedBook');
const BookInstance = require('../models/BookInstance');
const Book = require('../models/Book');
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
            description: `ID ${borrowedBook.user_id} borrowed Book Instance ${borrowedBook.book_instance_id} `,
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
   * @apiSuccess {Object} List of user borrow history.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "history": "[]"
   *     }
   *
   *
   */
  const getUserBorrowHistory = async (req, res) => {
    const { id_number } = req.token;

    try {
      const history = await BorrowedBook.findAll({
        where: {
          user_id: id_number,
        },
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

      return res.status(200).json({ history });
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
