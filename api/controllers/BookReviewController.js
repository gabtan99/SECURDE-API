const BookReview = require('../models/BookReview');
const Book = require('../models/Book');
const User = require('../models/User');
const logAction = require('../services/logger.service');

const LOG_TYPE = 'BOOK REVIEW';

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
      const bookReview = await BookReview.create(
        {
          book_id,
          user_id,
          review,
        },
        {
          include: [
            {
              model: Book,
              attributes: ['id', 'title', 'authors'],
            },
            {
              model: User,
              attributes: ['id_number'],
            },
          ],
        },
      );

      await logAction({
        user_id,
        type: LOG_TYPE,
        action: 'Added',
        description: `ID ${bookReview.user.id_number} reviewed ${bookReview.book.title} by ${bookReview.book.authors}`,
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

  /**
   * @api {get} /private/review Get User Review History
   * @apiName reviewHistory
   * @apiGroup Book Review
   *
   * @apiSuccess {Object} List of all user reviews.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "reviews": "[]"
   *     }
   *
   *
   */
  const getUserReviews = async (req, res) => {
    const { id_number } = req.token;

    try {
      const reviews = await BookReview.findAll({
        where: {
          user_id: id_number,
        },
        attributes: ['id', 'review'],
        include: [
          {
            model: Book,
            attributes: ['id', 'title', 'authors'],
          },
        ],
      });

      return res.status(200).json({ reviews });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: err.name });
    }
  };

  return {
    createBookReview,
    getUserReviews,
  };
};

module.exports = BookReviewController;
