const Sequelize = require('sequelize');
const Database = require('../../config/database');

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
      unique: true,
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

module.exports = Book;
