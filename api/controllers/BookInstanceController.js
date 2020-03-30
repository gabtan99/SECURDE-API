const Sequelize = require('sequelize');
const Book = require('../models/Book');
const BookInstance = require('../models/BookInstance');
const BorrowedBook = require('../models/BorrowedBook');
const logAction = require('../services/logger.service');

const LOG_TYPE = 'BOOK INSTANCE';

const BookInstanceController = () => {
  /**
   * @api {post} /private/book/{book_id}/instance Create Book Instance
   * @apiName createBookInstance
   * @apiGroup Book Instance
   *
   * @apiParam {Number} book_id Book ID of book instance (URL parameter).
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
    const { language } = req.body;

    try {
      const bookInstance = await BookInstance.create(
        {
          book_id,
          status: 'AVAILABLE',
          language,
        },
        {
          include: [
            {
              model: Book,
              attributes: ['id', 'title', 'authors'],
            },
          ],
        },
      );

      await logAction({
        user_id: req.token.id_number,
        type: LOG_TYPE,
        action: 'Added',
        description: `Instance ID: ${bookInstance.id}\nBook: ${bookInstance.book.title} by ${bookInstance.book.authors} `,
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
   * @apiParam {String} [status] Status of book instance [RESERVED, AVAILABLE] (Upper-cased).
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
          status,
          language,
        },
        {
          where: { book_id, id },
          returning: true,
          raw: true,
        },
      );

      if (!bookInstance[0]) {
        return res.status(404).json({
          err: { name: 'ResourceNotFound', msg: 'Book Instance not found' },
        });
      }

      if (status === 'AVAILABLE') {
        const latest = await BorrowedBook.findAll({
          attributes: [Sequelize.fn('max', Sequelize.col('id'))],
          where: { book_instance_id: id },
          raw: true,
        });

        await BorrowedBook.update(
          {
            return_date: Sequelize.fn('NOW'),
          },
          {
            where: { id: latest[0].max },
          },
        );
      }

      const result = bookInstance[1][0];

      await logAction({
        user_id: req.token.id_number,
        type: LOG_TYPE,
        action: 'Updated',
        description: `Instance ID: ${result.id}`,
      });

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

      if (!deleted) {
        return res.status(404).json({
          err: {
            name: 'ResourceNotFound',
            msg: 'Book instance not found',
          },
        });
      }

      await logAction({
        user_id: req.token.id_number,
        type: LOG_TYPE,
        action: 'Deleted',
        description: `Instance ID: ${id}`,
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
