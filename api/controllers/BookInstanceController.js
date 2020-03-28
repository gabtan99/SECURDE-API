const BookInstance = require('../models/BookInstance');

const BookInstanceController = () => {
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
   * @apiError BookNotFound Book does not exist.
   *
   */
  const createBookInstance = async (req, res) => {
    const { book_id } = req.params;
    const { status, language } = req.body;

    try {
      const bookInstance = await BookInstance.create({
        book_id,
        status: status.toUpperCase(),
        language,
      });

      return res.status(200).json({ bookInstance });
    } catch (err) {
      console.log(err);

      const { name } = err;
      if (name === 'SequelizeForeignKeyConstraintError') {
        return res.status(500).json({
          err: {
            name: 'BookNotFound',
            msg: 'Book does not exist',
          },
        });
      }
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  /**
   * @api {patch} /private/book/{book_id}/instance/{id} Update Book Instance
   * @apiName updateBookInstance
   * @apiGroup Book Instance
   *
   * @apiParam {Number} book_id Book ID (URL parameter).
   * @apiParam {Number} id Book Instance ID (URL parameter).
   * @apiParam {String} [status] Status of book instance.
   * @apiParam {String} [language] language of the book instance.
   *
   * @apiSuccess {String} msg Success Message.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "msg": "Book Instance Updated"
   *     }
   *
   * @apiError ResourceNotFound Book Instance is non-existent.
   *
   */
  const updateBookInstance = async (req, res) => {
    const { book_id, id } = req.params;
    const { status, language } = req.body;

    try {
      const bookInstance = await BookInstance.update(
        {
          status: status.toUpperCase(),
          language,
        },
        {
          where: { book_id, id },
        },
      );

      if (!bookInstance[0]) {
        return res.status(404).json({
          err: { name: 'ResourceNotFound', msg: 'Book Instance not found' },
        });
      }

      return res.status(200).json({ msg: 'Book Instance Updated' });
    } catch (err) {
      console.log(err);

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
    createBookInstance,
    updateBookInstance,
    deleteBookInstance,
  };
};

module.exports = BookInstanceController;
