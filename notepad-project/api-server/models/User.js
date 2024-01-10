const createUserTable = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    nickname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    pw: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
    logging: false, // Disable logging
    indexes: [
      {
        unique: true, // set to true if you want a unique index
        fields: ['userId'],
      },
    ],
  });

  User.sync({ alter: true });

  return User;
};

module.exports = createUserTable;