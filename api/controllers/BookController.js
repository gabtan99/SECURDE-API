const Book = require('../models/Book');

const BOOKS_PER_PAGE = 10;

const BookController = () => {
  const getBooks = async (req, res) => {
    const { page } = req.body;
    const limit = page ? BOOKS_PER_PAGE : null;
    const offset = (page - 1) * limit || 0;

    try {
      const results = await Book.findAndCountAll({
        where: {},
        limit,
        offset,
      });

      if (!page) {
        // if no page indicated, return default of 10 without metadata
        return res.status(200).json({ data: results.rows });
      }

      if (results.rows.length === 0) {
        return res.status(400).json({ msg: `Page ${page} does not exist` });
      }

      const meta = {
        pagination: {
          offset,
          limit,
          current_page: page || 1,
          page_count: Math.floor(results.count / limit),
          total_count: results.count,
        },
      };

      return res.status(200).json({ data: results.rows, meta });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  return {
    getBooks,
  };
};

module.exports = BookController;
