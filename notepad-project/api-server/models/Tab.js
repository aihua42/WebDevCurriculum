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
      allowNull: true,
      validate: {
        notEmpty: false
      }
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    logging: false, // Disable logging
  });

  Tab.sync({ alter: true });

  return Tab;
};

module.exports = createTabTable;