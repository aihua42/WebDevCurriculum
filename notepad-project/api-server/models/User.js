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
    indexes: [  // this can fix the issue caused by {alter: true}
      { 
        fields: ['userId'], 
        unique: true 
      }
    ],
    freezeTableName: true,
    timestamps: false,
  });

  User.sync({ alter: true });  // {alter: true} creates new index even if one already exists

  return User;
};

module.exports = createUserTable;