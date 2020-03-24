const User = require('../models/User');
const bcryptService = require('../services/bcrypt.service');

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

    if (!(access === 'STUDENT' || access === 'TEACHER'))
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
        username,
        password,
        email_address,
        access,
      });
      const token = authService().issue({
        id_number: user.id_number,
        access: user.access,
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
            username,
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

          return res.status(200).json({ token, user });
        }
      } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Internal server error' });
      }
    }

    return res.status(401).json({
      error: {
        name: 'Unauthorized',
        msg: 'Username / Password is incorrect',
      },
    });
  };

  const getAll = async (req, res) => {
    try {
      const users = await User.findAll();

      return res.status(200).json({ users });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

  return {
    register,
    login,
    getAll,
  };
};

module.exports = UserController;
