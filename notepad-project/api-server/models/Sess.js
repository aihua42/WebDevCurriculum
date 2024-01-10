const createSessionTable = (sequelize, DataTypes) => {
  const Sess = sequelize.define('Sess', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_logined : {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    sid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: `Sess`,
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

  return Sess;
};

module.exports = createSessionTable;
