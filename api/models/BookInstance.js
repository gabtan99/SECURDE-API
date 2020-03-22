const Sequelize = require('sequelize');
const Database = require('../../config/database');

const tableName = 'book_instance';

const BookInstance = Database.define(
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

module.exports = BookInstance;
