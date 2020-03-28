const BorrowedBook = require('../models/BorrowedBook');
const BookInstance = require('../models/BookInstance');

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
              err: { name: 'Unavailable', msg: 'Book Instance is already reserved.' },
            });
          }
          bookInstance.update({ status: 'RESERVED' });

          const borrowedBook = await BorrowedBook.create({
            book_instance_id,
            user_id,
          });
        })
        .catch(() => {
          return res.status(404).json({
            err: { name: 'BookInstanceNotFound', msg: 'Book Instance does not exist.' },
          });
        });

      return res.status(200).json({ msg: 'SUCCESS' });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  return {
    borrowBook,
  };
};

module.exports = BorrowedBookController;
