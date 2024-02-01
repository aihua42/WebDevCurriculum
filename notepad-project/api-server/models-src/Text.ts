import {
  type Sequelize,
  DataTypes,
  type Model,
  type BuildOptions
} from 'sequelize'
import { type TextRecord } from '../types.ts'

interface TextInstance extends Model<TextRecord>, TextRecord {}
type TextModel = typeof Model &
  (new (values?: object, options?: BuildOptions) => TextInstance)

const createTextTable = async (sequelize: Sequelize): Promise<TextModel> => {
  const Text = sequelize.define(
    'Text',
    {
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      textId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      freezeTableName: true,
      timestamps: false
    }
  )

  await Text.sync({ alter: true })

  return Text as TextModel
}

module.exports = createTextTable
