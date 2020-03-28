const Book = require('../models/Book');
const BookInstance = require('../models/BookInstance');
const BookReview = require('../models/BookReview');
const User = require('../models/User');
const { Op, literal } = require('sequelize');

const BOOKS_PER_PAGE = 10;

const BookController = () => {
  /**
   * @api {get} /public/books Get Books
   * @apiName getBooks
   * @apiGroup Book
   *
   * @apiParam {String} [keyword] Search keyword.
   * @apiParam {Number} [page] Get results in certain page.
   *
   * @apiSuccess {Object[]} data Array of books .
   * @apiSuccess {Object} meta Result Metadata.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "data": "[{}, {}, ...]",
   *       "meta": "{}"
   *     }
   *
   */

  const getBooks = async (req, res) => {
    const { page, keyword = '' } = req.body;
    const limit = page ? BOOKS_PER_PAGE : null;
    const offset = (page - 1) * limit || 0;

    try {
      const results = await Book.findAndCountAll({
        where: {
          title: { [Op.iLike]: `%${keyword}%` },
        },
        order: literal('id DESC'),
        limit,
        offset,
      });

      const meta = {
        pagination: {
          offset,
          limit,
          current_page: page,
          page_count: Math.ceil(results.count / limit),
          total_count: results.count,
        },
      };

      return res.status(200).json({ data: results.rows, meta });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: err.name });
    }
  };

  /**
   * @api {get} /public/books/{id} Get Book Details
   * @apiName getBookbyID
   * @apiGroup Book
   *
   * @apiParam {Number} id Book id.
   *
   * @apiSuccess {Object} book Complete book object with instances / reviews.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "book": "{}"
   *     }
   *
   * @apiError ResourceNotFound Book not found.
   *
   */

  const getBook = async (req, res) => {
    const { id } = req.params;

    try {
      const book = await Book.findOne({
        where: {
          id: id,
        },
        include: [
          {
            model: BookInstance,
            attributes: ['id', 'status', 'language'],
          },
          {
            model: BookReview,
            include: [{ model: User, attributes: ['id_number', 'name'] }],
            attributes: ['id', 'review'],
          },
        ],
      });

      if (book === null) return res.status(404).json({ msg: 'Book not found' });

      return res.status(200).json({ book });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: err.name });
    }
  };

  /**
   * @api {post} /private/book Create Book
   * @apiName createBook
   * @apiGroup Book
   *
   * @apiParam {String} title Title of book.
   * @apiParam {String} publisher Publisher of book.
   * @apiParam {Number} year_of_publication Year of publication of book.
   * @apiParam {Number} isbn 3-digit Call Number based on the Dewey Decimal System.
   * @apiParam {String} authors authors of the book.
   *
   * @apiSuccess {Object} book Complete book details.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "book": "{}"
   *     }
   *
   * @apiError ResourceNotFound Book not found.
   *
   *
   */
  const createBook = async (req, res) => {
    const { title, publisher, year_of_publication, isbn, authors } = req.body;

    try {
      const book = await Book.create({
        title,
        publisher,
        year_of_publication,
        isbn,
        authors,
      });

      return res.status(200).json({ book });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  /**
   * @api {patch} /private/book/{id} Update Book
   * @apiName updateBook
   * @apiGroup Book
   *
   * @apiParam {Number} id Book id.
   * @apiParam {String} [title] Title of book.
   * @apiParam {String} [publisher] Publisher of book.
   * @apiParam {Number} [year_of_publication] Year of publication of book.
   * @apiParam {Number} [isbn] 3-digit Call Number based on the Dewey Decimal System.
   * @apiParam {String} [status] status of the book.
   * @apiParam {String} [authors] authors of the book.
   *
   * @apiSuccess {String} msg Success message.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "msg": "Book Updated"
   *     }
   *
   * @apiError ResourceNotFound Book not found.
   *
   *
   */
  const updateBook = async (req, res) => {
    const { id } = req.params;
    const { title, publisher, year_of_publication, isbn, authors } = req.body;

    try {
      const book = await Book.update(
        {
          title,
          publisher,
          year_of_publication,
          isbn,
          authors,
        },
        {
          where: { id },
        },
      );

      if (!book[0]) {
        return res.status(404).json({
          err: { name: 'ResourceNotFound', msg: 'Book not found' },
        });
      }

      return res.status(200).json({ msg: 'Book Updated' });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  /**
   * @api {delete} /private/book/{id} Delete Book
   * @apiName deleteBook
   * @apiGroup Book
   *
   * @apiParam {Number} id Book id.
   *
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "msg": "SUCCESS"
   *     }
   */

  const deleteBook = async (req, res) => {
    const { id } = req.params;

    try {
      const deleted = await Book.destroy({
        where: {
          id: id,
        },
      });

      if (!deleted)
        return res.status(404).json({
          err: { name: 'ResourceNotFound', msg: 'Book not found' },
        });

      return res.status(200).json({ msg: 'SUCCESS' });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: err.name });
    }
  };

  return {
    getBooks,
    getBook,
    createBook,
    updateBook,
    deleteBook,
  };
};

module.exports = BookController;
