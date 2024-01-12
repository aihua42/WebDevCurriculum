const createTextTable = (sequelize, DataTypes) => {
  const Text = sequelize.define('Text', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    textId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
  });

  Text.sync({ alter: true });

  return Text;
};

module.exports = createTextTable;