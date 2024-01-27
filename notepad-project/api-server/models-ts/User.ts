import {
  type Sequelize,
  DataTypes,
  type Model,
  type BuildOptions
} from 'sequelize'
import { type UserAttributes } from '../types'

interface UserInstance extends Model<UserAttributes>, UserAttributes {}
type UserModel = typeof Model &
  (new (values?: object, options?: BuildOptions) => UserInstance)

const createUserTable = async (sequelize: Sequelize): Promise<UserModel> => {
  const User = sequelize.define(
    'User',
    {
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
      indexes: [
        // this can fix the issue caused by {alter: true}
        {
          fields: ['userId'],
          unique: true
        }
      ],
      freezeTableName: true,
      timestamps: false
    }
  )

  await User.sync({ alter: true }) // {alter: true} creates new index even if one already exists

  return User as UserModel
}

module.exports = createUserTable
