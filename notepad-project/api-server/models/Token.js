const createTokenTable = (sequelize, DataTypes) => {
  const Token = sequelize.define('Token', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    }
  },
  {
    tableName: `Token`,
    freezeTableName: true,
    timestamps: false
  });

  return Token;
};

module.exports = createTokenTable;
