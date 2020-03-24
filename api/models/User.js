const Sequelize = require('sequelize');
const bcryptService = require('../services/bcrypt.service');
const Database = require('../../config/database');

const hooks = {
  beforeCreate(user) {
    user.password = bcryptService().password(user); // eslint-disable-line no-param-reassign
  },
};

const tableName = 'user';

const User = Database.define(
  tableName,
  {
    id_number: {
      type: Sequelize.BIGINT,
      primaryKey: true,
      unique: true,
      allowNull: false,
      required: true,
      field: 'id_number',
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'name',
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      field: 'username',
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'password',
    },
    email_address: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      field: 'email_address',
    },
    access: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'access',
    },
  },
  {
    hooks,
    tableName,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

User.prototype.toJSON = function() {
  const values = { ...this.get() };

  delete values.password;

  return values;
};

module.exports = User;
