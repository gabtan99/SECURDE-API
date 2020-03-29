const Log = require('../models/Log');

const logAction = async ({ user_id, type, action, description }) => {
  try {
    await Log.create({
      user_id,
      type,
      action,
      description,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = logAction;
