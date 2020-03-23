const User = require('../models/User');
const authService = require('../services/auth.service');
const bcryptService = require('../services/bcrypt.service');

const UserController = () => {
  /**
   * @api {get} /register Create new user account
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
   * @apiError {409} Existing id number.
   */

  const register = async (req, res) => {
    const { id_number, name, username, password, email_address, access } = req.body;

    try {
      const user = await User.create({
        id_number,
        name,
        username,
        password,
        email_address,
        access,
      });
      const token = authService().issue({ id: user.id_number });

      return res.status(200).json({ token, user });
    } catch (err) {
      console.log(err);
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ msg: 'ID Number already exists' });
      }

      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

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
          return res.status(400).json({ msg: 'Error: User not found' });
        }

        if (bcryptService().comparePassword(password, user.password)) {
          const token = authService().issue({ id: user.id_number });

          return res.status(200).json({ token, user });
        }

        return res.status(401).json({ msg: 'Unauthorized' });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: 'Internal server error' });
      }
    }

    return res.status(400).json({ msg: 'Bad Request: Email or password is wrong' });
  };

  const validate = (req, res) => {
    const { token } = req.body;

    authService().verify(token, err => {
      if (err) {
        return res.status(401).json({ isvalid: false, err: 'Invalid Token!' });
      }

      return res.status(200).json({ isvalid: true });
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
    validate,
    getAll,
  };
};

module.exports = UserController;
