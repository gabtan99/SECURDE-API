const Sequelize = require('sequelize');
const Database = require('../../config/database');
const User = require('./User');

const tableName = 'log';

const Log = Database.define(
  tableName,
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      unique: true,
      autoIncrement: true,
      field: 'id',
    },
    date_time: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false,
      field: 'date_time',
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'user_id',
    },
    action: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'action',
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'type',
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'description',
    },
  },
  {
    tableName,
    timestamps: false,
  },
);

Log.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Log;
