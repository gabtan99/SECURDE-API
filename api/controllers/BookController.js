const Book = require('../models/Book');
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
  const createBook = async (req, res) => {
    const { id, title, publisher, year_of_publication, isbn, status, authors, reviews } = req.body;

    try {
      const book = await Book.create({
        id,
        title,
        publisher,
        year_of_publication,
        isbn,
        status,
        authors,
        reviews,
      });

      return res.status(200).json({ book });
    } catch (err) {
      console.log(err);

      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ msg: 'ID already exists' });
      }

      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  /**
   * @api {get} /public/books/:id Get Book with ID
   * @apiName getBookbyID
   * @apiGroup Book
   *
   * @apiParam {Number} id Book id.
   *
   * @apiSuccess {Object} book Complete book object.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "book": "{}"
   *     }
   */

  const getBook = async (req, res) => {
    const { id } = req.params;

    try {
      const book = await Book.findOne({
        where: {
          id: id,
        },
      });

      return res.status(200).json({ book });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: err.name });
    }
  };

  const createBook = async (req, res) => {
    const { title, publisher, year_of_publication, isbn, status, authors, reviews } = req.body;

    try {
      const book = await Book.create({
        title,
        publisher,
        year_of_publication,
        isbn,
        status,
        authors,
        reviews,
      });

      return res.status(200).json({ book });
    } catch (err) {
      console.log(err);

      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  return {
    getBooks,
    getBook,
    createBook,
  };
};

module.exports = BookController;
