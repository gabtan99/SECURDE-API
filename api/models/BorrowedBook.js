const Sequelize = require('sequelize');
const Database = require('../../config/database');

const tableName = 'borrowed_book';

const BorrowedBook = Database.define(
  tableName,
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      allowNull: false,
      field: 'id',
    },
    book_instance_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'book_id',
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'user_id',
      },
    borrow_date: {
      type: Sequelize.DATE,
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

module.exports = BorrowedBook;
