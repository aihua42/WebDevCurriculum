const createSessionTable = (sequelize, DataTypes) => {
  const Sess = sequelize.define('Sess', {
    sid: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    data: {
      type: DataTypes.JSON,
      allowNull: true,
      validate: {
        notEmpty: false
      }
    }
  },
  {
    tableName: `Sess`,
    freezeTableName: true,
    timestamps: false
  });

  return Sess;
};

module.exports = createSessionTable;
