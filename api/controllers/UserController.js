const User = require('../models/User');
const logAction = require('../services/logger.service');
const bcryptService = require('../services/bcrypt.service');
const authService = require('../services/auth.service');

const LOG_TYPE = 'USER';

const UserController = () => {
  /**
   * @api {post} /public/register Register User
   * @apiName Register
   * @apiGroup User
   *
   * @apiParam {Number} id_number Unique student ID number.
   * @apiParam {String} name Full name of student.
   * @apiParam {String} username Unique username.
   * @apiParam {String} password user password.
   * @apiParam {String} email_address Email address of the user
   * @apiParam {String} access Access type of the user (STUDENT, TEACHER, etc..)
   *
   * @apiSuccess {String} token Authentication token.
   * @apiSuccess {Object} user Complete user details.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "token": "xxxx",
   *       "user": "{}"
   *     }
   *
   * @apiError SequelizeUniqueConstraintError Existing id number / username / email.
   * @apiError Unauthorized You are not allowed to make this type of account.
   */

  const register = async (req, res) => {
    const { id_number, name, username, password, email_address, access } = req.body;

    if (!(access.toUpperCase() === 'STUDENT' || access.toUpperCase() === 'TEACHER'))
      return res.status(401).json({
        error: {
          name: 'Unauthorized',
          msg: 'You are not allowed to make this type of account.',
        },
      });

    try {
      const user = await User.create({
        id_number,
        name,
        username: username.toLowerCase(),
        password,
        email_address: email_address.toLowerCase(),
        access: access.toUpperCase(),
      });
      const token = authService().issue({
        id_number: user.id_number,
        access: user.access,
      });

      await logAction({
        user_id: user.id_number,
        type: LOG_TYPE,
        action: 'Register',
        description: `N/A`,
      });
      return res.status(200).json({ token, user });
    } catch (err) {
      const { name, parent } = err;
      if (name === 'SequelizeUniqueConstraintError') {
        if (parent.constraint === 'unique_username') {
          return res.status(409).json({ error: { name, msg: 'Username already exists' } });
        } else if (parent.constraint === 'unique_email') {
          return res.status(409).json({
            error: { name, msg: 'Email address already exists' },
          });
        }
        return res.status(409).json({ error: { name, msg: 'ID Number already exists' } });
      }

      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  /**
   * @api {post} /public/login Login User
   * @apiName Login
   * @apiGroup User
   *
   * @apiParam {String} username Username.
   * @apiParam {String} password Password.
   *
   * @apiSuccess {String} token Authentication token.
   * @apiSuccess {Object} user Complete user details.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "token": "xxxx",
   *       "user": "{}"
   *     }
   *
   * @apiError UserNotFound User not found.
   * @apiError Unauthorized Username / Password is incorrect.
   */

  const login = async (req, res) => {
    const { username, password } = req.body;

    if (username && password) {
      try {
        const user = await User.findOne({
          where: {
            username: username.toLowerCase(),
          },
        });

        if (!user) {
          return res.status(400).json({
            error: { name: 'UserNotFound', msg: 'User not found' },
          });
        }

        if (bcryptService().comparePassword(password, user.password)) {
          const token = authService().issue({
            id_number: user.id_number,
            access: user.access,
          });

          await logAction({
            user_id: user.id_number,
            type: LOG_TYPE,
            action: 'Login',
            description: `N/A`,
          });
          return res.status(200).json({ token, user });
        }

        return res.status(401).json({
          error: {
            name: 'Unauthorized',
            msg: 'Username / Password is incorrect',
          },
        });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Internal server error' });
      }
    }
  };

  /**
   * @api {get} /private/users/{role} Get Users
   * @apiName getUsers
   * @apiGroup User
   *
   * @apiParam {String} [role] Access type of user.
   *
   * @apiSuccess {Object} users Array of users.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "users": []
   *     }
   *
   */
  const getUsers = async (req, res) => {
    const { role } = req.params;
    const conditions = role ? { access: role.toUpperCase() } : {};

    try {
      const users = await User.findAll({
        where: conditions,
      });

      return res.status(200).json({ users });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  /**
   * @api {PATCH} /private/reset-password Change Password
   * @apiName ResetPassword
   * @apiGroup User
   *
   * @apiParam {String} old_password old password.
   * @apiParam {String} new_password new password.
   *
   * @apiSuccess {String} token Authentication token.
   * @apiSuccess {Object} user Complete user details.
   * @apiSuccess {String} msg Success message.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "token": "xxxx",
   *       "user": "{}",
   *       "msg": "Password Changed"
   *     }
   *
   * @apiError UserNotFound User not found.
   * @apiError Unauthorized Old password is incorrect.
   */

  const resetPassword = async (req, res) => {
    const { token, body } = req;
    const { old_password, new_password } = body;
    const { id_number } = token;

    try {
      const user = await User.findOne({
        where: {
          id_number,
        },
      });

      if (!user) {
        return res.status(400).json({
          error: { name: 'UserNotFound', msg: 'User not found' },
        });
      }

      if (bcryptService().comparePassword(old_password, user.password)) {
        user.password = new_password;
        const password = bcryptService().password(user);
        user.update({ password });

        const token = authService().issue({
          id_number: user.id_number,
          access: user.access,
        });

        await logAction({
          user_id: user.id_number,
          type: LOG_TYPE,
          action: 'Reset Password',
          description: `N/A`,
        });

        return res.status(200).json({ token, user, msg: 'Password Changed' });
      }

      return res.status(401).json({
        error: {
          name: 'Unauthorized',
          msg: 'Old password is incorrect.',
        },
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  /**
   * @api {post} /private/register-manager Register Manager
   * @apiName RegisterManager
   * @apiGroup User
   *
   * @apiParam {Number} id_number Unique Manager ID number.
   * @apiParam {String} name Full name of Manager.
   * @apiParam {String} username Unique username.
   * @apiParam {String} password user password.
   * @apiParam {String} email_address Email address of the user
   *
   * @apiSuccess {Object} user Complete user details.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "user": "{}"
   *     }
   *
   * @apiError SequelizeUniqueConstraintError Existing id number / username / email.
   */

  const registerManager = async (req, res) => {
    const { id_number, name, username, password, email_address } = req.body;

    try {
      const user = await User.create({
        id_number,
        name,
        username: username.toLowerCase(),
        password,
        email_address: email_address.toLowerCase(),
        access: 'MANAGER',
      });

      await logAction({
        user_id: req.token.id_number,
        type: LOG_TYPE,
        action: 'Register Manager',
        description: `ID: ${user.id_number}\nName: ${user.name}\nEmail: ${user.email_address}\n`,
      });
      return res.status(200).json({ user });
    } catch (err) {
      const { name, parent } = err;
      if (name === 'SequelizeUniqueConstraintError') {
        if (parent.constraint === 'unique_username') {
          return res.status(409).json({ error: { name, msg: 'Username already exists' } });
        } else if (parent.constraint === 'unique_email') {
          return res.status(409).json({
            error: { name, msg: 'Email address already exists' },
          });
        }
        return res.status(409).json({ error: { name, msg: 'ID Number already exists' } });
      }

      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  return {
    register,
    login,
    getUsers,
    resetPassword,
    registerManager,
  };
};

module.exports = UserController;
