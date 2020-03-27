const BookReview = require('../models/BookReview');

const BookReviewController = () => {
  /**
   * @api {post} /private/book/{book_id}/instance Create Book Instance
   * @apiName createBookInstance
   * @apiGroup Book Instance
   *
   * @apiParam {Number} book_id Book ID of book instance (URL parameter).
   * @apiParam {String} status Status of book instance.
   * @apiParam {String} language language of the book instance.
   *
   * @apiSuccess {Object} Complete book instance details.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "bookInstance": "{}"
   *     }
   *
   * @apiError BookNotFound Book is non-existent.
   *
   */
  const createBookReview = async (req, res) => {
    const { book_id } = req.params;
    const { review } = req.body;
    const user_id = req.token.id_number;

    try {
      const bookReview = await BookReview.create({
        book_id,
        user_id,
        review,
      });

      return res.status(200).json({ msg: 'SUCCESS' });
    } catch (err) {
      console.log(err);

      if (err.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(404).json({ msg: 'Book is non-existent' });
      }
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  /**
   * @api {delete} /private/{book_id}/instance/{id} Delete Book Instance
   * @apiName deleteBookInstanceByID
   * @apiGroup Book Instance
   *
   * @apiParam {Number} book_id Book id.
   * @apiParam {Number} id Book instance id.
   *
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "msg": "SUCCESS"
   *     }
   *
   * @apiError ResourceNotFound Book instance not found.
   *
   */

  const deleteBookInstance = async (req, res) => {
    const { book_id, id } = req.params;

    try {
      const deleted = await BookInstance.destroy({
        where: {
          id,
          book_id,
        },
      });

      if (!deleted)
        return res.status(404).json({
          err: {
            name: 'ResourceNotFound',
            msg: 'Book instance not found',
          },
        });

      return res.status(200).json({ msg: 'SUCCESS' });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: err.name });
    }
  };

  return {
    createBookReview,
    deleteBookInstance,
  };
};

module.exports = BookReviewController;
