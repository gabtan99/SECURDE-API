const Sequelize = require('sequelize');
const Database = require('../../config/database');
const User = require('./User');
const Book = require('./Book');

const tableName = 'book_review';

const BookReview = Database.define(
  tableName,
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
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

Book.hasMany(BookReview, { foreignKey: 'book_id' });
BookReview.belongsTo(Book, { foreignKey: 'book_id' });
BookReview.belongsTo(User, { foreignKey: 'user_id' });

module.exports = BookReview;
