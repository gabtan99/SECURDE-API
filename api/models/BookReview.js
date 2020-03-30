const Sequelize = require('sequelize');
const Database = require('../../config/database');
const User = require('./User');
const Book = require('./Book');

const hooks = {
  afterCreate: bookReview => bookReview.reload(),
};

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
    hooks,
    tableName,
    timestamps: false,
  },
);

BookReview.prototype.toJSON = function() {
  const values = { ...this.get() };

  delete values.book_id;
  delete values.user_id;

  return values;
};

Book.hasMany(BookReview, { foreignKey: 'book_id' });
BookReview.belongsTo(Book, { foreignKey: 'book_id' });
BookReview.belongsTo(User, { foreignKey: 'user_id' });

module.exports = BookReview;
