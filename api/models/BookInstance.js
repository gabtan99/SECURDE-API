const Sequelize = require('sequelize');
const Database = require('../../config/database');
const Book = require('../models/Book');

const tableName = 'book_instance';

const BookInstance = Database.define(
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
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'status',
    },
    language: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'language',
    },
  },
  {
    tableName,
    timestamps: false,
  },
);

Book.hasMany(BookInstance, { foreignKey: 'book_id' });
BookInstance.belongsTo(Book, { foreignKey: 'book_id' });

module.exports = BookInstance;
