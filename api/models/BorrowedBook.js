const Sequelize = require('sequelize');
const Database = require('../../config/database');
const User = require('../models/User');
const BookInstance = require('../models/BookInstance');

const tableName = 'borrowed_book';

const BorrowedBook = Database.define(
  tableName,
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      field: 'id',
    },
    book_instance_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'book_instance_id',
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'user_id',
    },
    borrow_date: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false,
      field: 'borrow_date',
    },
    return_date: {
      type: Sequelize.DATE,
      allowNull: true,
      field: 'return_date',
    },
  },
  {
    tableName,
    timestamps: false,
  },
);

BorrowedBook.belongsTo(User, { foreignKey: 'user_id' });
BorrowedBook.belongsTo(BookInstance, { foreignKey: 'book_instance_id' });

module.exports = BorrowedBook;
