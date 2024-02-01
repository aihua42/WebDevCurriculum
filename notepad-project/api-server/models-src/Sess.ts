import {
  type Sequelize,
  DataTypes,
  type Model,
  type BuildOptions
} from 'sequelize'
import { type SessAttributes } from '../types.ts'

interface SessInstance extends Model<SessAttributes>, SessAttributes {}
type SessModel = typeof Model &
  (new (values?: object, options?: BuildOptions) => SessInstance)

const createSessionTable = (sequelize: Sequelize): SessModel => {
  const Sess = sequelize.define(
    'Sess',
    {
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
      indexes: [
        // this can fix the issue caused by {alter: true}
        {
          fields: ['sid'],
          unique: true
        }
      ],
      tableName: 'Sess',
      freezeTableName: true,
      timestamps: false
    }
  )

  return Sess as SessModel
}

module.exports = createSessionTable
