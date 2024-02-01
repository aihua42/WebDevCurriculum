import {
  type Sequelize,
  DataTypes,
  type Model,
  type BuildOptions
} from 'sequelize'
import { type TabRecord } from '../types.ts'

interface TabInstance extends Model<TabRecord>, TabRecord {}
type TabModel = typeof Model &
  (new (values?: object, options?: BuildOptions) => TabInstance)

const createTabTable = async (sequelize: Sequelize): Promise<TabModel> => {
  const Tab = sequelize.define(
    'Tab',
    {
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      active: {
        type: DataTypes.BOOLEAN,
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

  await Tab.sync({ alter: true })

  return Tab as TabModel
}

module.exports = createTabTable
