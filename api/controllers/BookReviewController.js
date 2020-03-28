const BookReview = require('../models/BookReview');

const BookReviewController = () => {
  /**
   * @api {post} /private/review/{book_id} Review Book
   * @apiName reviewBook
   * @apiGroup Book Review
   *
   * @apiParam {Number} book_id Book ID.
   * @apiParam {String} review Content of the review.
   *
   * @apiSuccess {String} Success message.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "msg": "SUCCESS"
   *     }
   *
   * @apiError BookNotFound Book does not exist.
   *
   */
  const createBookReview = async (req, res) => {
    const { book_id } = req.params;
    const { review } = req.body;
    const user_id = req.token.id_number;

    try {
      await BookReview.create({
        book_id,
        user_id,
        review,
      });

      return res.status(200).json({ msg: 'SUCCESS' });
    } catch (err) {
      console.log(err);

      if (err.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(404).json({ msg: 'Book does not exist' });
      }
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  return {
    createBookReview,
  };
};

module.exports = BookReviewController;
