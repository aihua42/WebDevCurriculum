const createTokenTable = (sequelize, DataTypes) => {
  const Token = sequelize.define('Token', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING(512),  // DataTypes.TEXT, // Error: BLOB/TEXT column 'token' used in key specification without a key length
      allowNull: false
    }
  },
  {
    tableName: `Token`,
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

  Token.sync({ alter: true });

  return Token;
};

module.exports = createTokenTable;
