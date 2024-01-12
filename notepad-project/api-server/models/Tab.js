const createTabTable = (sequelize, DataTypes) => {
  const Tab = sequelize.define('Tab', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    active: {
      type: DataTypes.BOOLEAN,
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

  Tab.sync({ alter: true });

  return Tab;
};

module.exports = createTabTable;