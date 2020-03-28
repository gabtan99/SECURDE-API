const BorrowedBook = require('../models/BorrowedBook');

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
   * @apiError BookInstanceNotFound Book Instance does not exist.
   *
   */
  const borrowBook = async (req, res) => {
    const { book_instance_id } = req.params;
    const user_id = req.token.id_number;

    try {
      const borrowedBook = await BorrowedBook.create({
        book_instance_id,
        user_id,
      });

      return res.status(200).json({ msg: 'SUCCESS' });
    } catch (err) {
      console.log(err);

      if (err.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(404).json({ msg: 'Book Instance does not exist' });
      }
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  return {
    borrowBook,
  };
};

module.exports = BorrowedBookController;
