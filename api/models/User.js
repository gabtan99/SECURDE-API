const Sequelize = require('sequelize');
const bcryptService = require('../services/bcrypt.service');
const Database = require('../../config/database');

const hooks = {
  beforeCreate(user) {
    user.password = bcryptService().password(user); // eslint-disable-line no-param-reassign
  },
};

const tableName = 'user';

const User = Database.define('User', {
  id_number: {
    type: Sequelize.BIGINT,
    unique: true,
    allowNull: false,
    required: true,
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
  },
}, { hooks, tableName });

// eslint-disable-next-line
User.prototype.toJSON = function () {
  const values = { ...this.get() };

  delete values.password;

  return values;
};

module.exports = User;
