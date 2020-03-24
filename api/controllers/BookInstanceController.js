const BookInstance = require('../models/BookInstance');
const { Op } = require('sequelize');

const BookInstanceController = () => {
  
 /**
   * @api {post} /public/book-instances Post BookInstances
   * @apiName createBookInstance
   * @apiGroup BookInstance
   *
   * @apiParam {Number} id Unique Book Instance id.
   * @apiParam {Number} book_id Book ID of book instance.
   * @apiParam {String} status Status of book instance.
   * @apiParam {String} language language of the book instance.
   *
   * @apiSuccess {Object} book instance Complete book instance details.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "bookInstance": "{}"
   *     }
   *
   * @apiError SequelizeUniqueConstraintError Existing id.
   *
   */
  const createBookInstance = async (req, res) => {
    const {id, book_id, status, language} = req.body;

    try {
      const bookInstance = await BookInstance.create({
        id, 
        book_id, 
        status, 
        language
      });
      

      return res.status(200).json({bookInstance});
    } catch (err) {
      console.log(err);

      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ msg: 'ID already exists' });
      }

      return res.status(500).json({ msg: 'Internal server error' });
    }
  };

   /**
   * @api {delete} /public/book/:id/instance Delete Book with ID
   * @apiName deleteBookInstancebyID
   * @apiGroup BookInstance
   *
   * @apiParam {Number} id Book instance id.
   *
   * @apiSuccess {String} SUCCESS.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "msg": "SUCCESS"
   *     }
   */

  const deleteBookInstance = async (req, res) => {
    const { id } = req.params;

    try {
      const bookInstance = await BookInstance.destroy({
        where: {
          id: id,
        },
      });

      return res.status(200).json({ msg: "SUCCESS" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: err.name });
    }
  };

  return {
    createBookInstance,
    deleteBookInstance,
  };
};

module.exports = BookInstanceController;
