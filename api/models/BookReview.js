const Sequelize = require('sequelize');
const Database = require('../../config/database');

const tableName = 'book_review';

const BookReview = Database.define(
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
    book_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'book_id',
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'user_id',
      },
    review: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'review',
    },
   
  },
  {
    tableName,
    timestamps: false,
  },
);

module.exports = BookReview;
