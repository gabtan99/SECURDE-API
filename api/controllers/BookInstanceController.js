const BookInstance = require('../models/BookInstance');
const { Op } = require('sequelize');

const BookInstanceController = () => {
  
  const createBookInstance = async (req, res) => {
    const {id, book_id, status, language} = req.body;

    try {
      const bookInstance = await Book.create({
        id, 
        book_id, 
        status, 
        language
      });
      

      return res.status(200).json({bookInstance});
    } catch (err) {
      console.log(err);

      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ msg: 'ID already exists' });
      }

      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  return {
    createBookInstance,
  };
};

module.exports = BookInstanceController;
