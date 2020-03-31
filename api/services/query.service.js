const { Op } = require('sequelize');

const orderBy = params => {
  let sortBy = [];
  let conditions = params.split(';');
  conditions.map(item => {
    let [column, order] = item.split(':');
    sortBy.push([column, order]);
  });

  return sortBy;
};

const between = (param1, param2) => {
  return {
    [Op.between]: [param1, param2],
  };
};

const search = param => {
  return { [Op.iLike]: '%' + param + '%' };
};

module.exports = {
  orderBy,
  between,
  search,
};
