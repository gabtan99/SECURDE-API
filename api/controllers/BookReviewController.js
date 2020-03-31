const { calculateLimitAndOffset, paginate } = require('paginate-info');
const BookReview = require('../models/BookReview');
const Book = require('../models/Book');
const User = require('../models/User');
const { orderBy, between } = require('../services/query.service');
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
        description: `Reviewed ${bookReview.book.title} by ${bookReview.book.authors}`,
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
   * @apiParam {Number} [currentPage] Desired Page.
   * @apiParam {Number} [pageSize] Number of elements per page.
   * @apiParam {String} [sort] Sort by conditions (semi-colon separated).
   * @apiParamExample Request-Example:
   *     {
   *      "currentPage": 1,
   *      "pageSize": 2,
   *      "sort": "id:asc"
   *      }
   *
   * @apiSuccess {Object} List of all user reviews.
   * @apiSuccess {Object} meta Metadata for pagination.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "reviews": [],
   *        "meta": {}
   *     }
   *
   *
   */
  const getUserReviews = async (req, res) => {
    const { currentPage, pageSize = 10, sort } = req.query;
    const { limit, offset } = calculateLimitAndOffset(currentPage, pageSize);
    const { id_number } = req.token;
    let options = { where: { user_id: id_number }, order: [] };

    if (sort) options.order = orderBy(sort);

    try {
      const { rows, count } = await BookReview.findAndCountAll({
        limit,
        offset,
        ...options,
        attributes: ['id', 'review'],
        include: [
          {
            model: Book,
            attributes: ['id', 'title', 'authors'],
          },
        ],
      });

      const meta = paginate(currentPage, count, rows, pageSize);

      return res.status(200).json({ reviews: rows, meta });
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
