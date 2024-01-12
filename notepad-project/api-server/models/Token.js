const createTokenTable = (sequelize, DataTypes) => {
  const Token = sequelize.define('Token', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING(512),  // DataTypes.TEXT, // Error: BLOB/TEXT column 'token' used in key specification without a key length
      allowNull: false
    }
  },
  {
    indexes: [  // this can fix the issue caused by {alter: true}
      { 
        fields: ['userId'], 
        unique: true 
      }
    ],
    tableName: `Token`,
    freezeTableName: true,
    timestamps: false,
  });

  Token.sync({ alter: true });

  return Token;
};

module.exports = createTokenTable;
