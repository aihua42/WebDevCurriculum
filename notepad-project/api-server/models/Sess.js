const createSessionTable = (sequelize, DataTypes) => {
  const Sess = sequelize.define('Sess', {
    sid: {
      type: DataTypes.STRING(512),
      allowNull: false
    },
    data: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  },
  {
    indexes: [  // this can fix the issue caused by {alter: true}
      { 
        fields: ['sid'], 
        unique: true 
      }
    ],
    tableName: `Sess`,
    freezeTableName: true,
    timestamps: false
  });

  return Sess;
};

module.exports = createSessionTable;
