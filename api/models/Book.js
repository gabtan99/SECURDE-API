const Sequelize = require('sequelize');
const Database = require('../../config/database');
const BookInstance = require('./BookInstance');
const BookReview = require('./BookReview');

const tableName = 'book';

const Book = Database.define(
  tableName,
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      field: 'id',
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'title',
    },
    publisher: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'publisher',
    },
    year_of_publication: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'year_of_publication',
    },
    isbn: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'isbn',
    },
    authors: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'authors',
    },
  },
  {
    tableName,
    timestamps: false,
  },
);

Book.hasMany(BookInstance, { foreignKey: 'book_id' });
Book.hasMany(BookReview, { foreignKey: 'book_id' });

module.exports = Book;
