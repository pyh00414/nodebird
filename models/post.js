module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    "post",
    {
      content: {
        type: DataTypes.STRING(15),
        allowNull: false
      },
      img: {
        type: DataTypes.STRING(200),
        allowNull: false
      }
    },
    {
      timestamp: true,
      paranoid: true
    }
  );
