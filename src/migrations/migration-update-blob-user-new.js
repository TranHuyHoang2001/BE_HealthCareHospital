module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
        "Users",
        "image",
        {
          type: Sequelize.BLOB('long'),  //tinyblob, mediumblob, longblob
          allowNull: true,
        }
      ),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(
        "Users",
        "image",
        {
          type: Sequelize.STRING,
          allowNull: true,
        }
      ),
    ]);
  },
};
