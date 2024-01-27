import {
  type Sequelize,
  DataTypes,
  type Model,
  type BuildOptions
} from 'sequelize'
import { type TokenAttributes } from '../types'

interface TokenInstance extends Model<TokenAttributes>, TokenAttributes {}
type TokenModel = typeof Model &
  (new (values?: object, options?: BuildOptions) => TokenInstance)

const createTokenTable = async (sequelize: Sequelize): Promise<TokenModel> => {
  const Token = sequelize.define(
    'Token',
    {
      userId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      token: {
        type: DataTypes.STRING(512), // DataTypes.TEXT, // Error: BLOB/TEXT column 'token' used in key specification without a key length
        allowNull: false
      }
    },
    {
      indexes: [
        // this can fix the issue caused by {alter: true}
        {
          fields: ['userId'],
          unique: true
        }
      ],
      tableName: 'Token',
      freezeTableName: true,
      timestamps: false
    }
  )

  await Token.sync({ alter: true })

  return Token as TokenModel
}

module.exports = createTokenTable
