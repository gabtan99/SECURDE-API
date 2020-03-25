const BookInstance = require('../models/BookInstance');
const { Op } = require('sequelize');

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
   * @apiError BookNotFound Book is non-existent.
   *
   */
  const createBookInstance = async (req, res) => {
    const { book_id } = req.params;
    const { status, language } = req.body;

    try {
      const bookInstance = await BookInstance.create({
        book_id,
        status,
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
            msg: 'Book is non-existent',
          },
        });
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
    createBookInstance,
    deleteBookInstance,
  };
};

module.exports = BookInstanceController;
