'use strict'

import * as fs from 'fs'
import * as path from 'path'
import { Sequelize, type Options } from 'sequelize'

import { type Config, type ModelType, type DB } from '../types.ts'

const basename: string = path.basename(__filename)
const env = 'development'
const configPath: string = path.join(__dirname, '..', 'config', 'config.json')
const rawConfig: string = fs.readFileSync(configPath, 'utf-8')
const config: Config = JSON.parse(rawConfig)[env]
const db: DB = {}

const sequelizeOptions: Options = {
  database: config.database,
  username: config.username,
  password: config.password,
  host: config.host,
  dialect: 'mysql', // config.dialect는 에러가...
  logging: config.logging
}

const sequelize: Sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  sequelizeOptions
)

async function initializeModels (): Promise<void> {
  const files: string[] = fs.readdirSync(__dirname)
  for (const file of files) {
    if (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.ts'
    ) {
      const model: ModelType = await import(path.join(__dirname, file)).then(
        (module) => module.default(sequelize)
      )
      db[model.name] = model
    }
  }
}

initializeModels()
  .then(() => {
    db.sequelize = sequelize
    db.Sequelize = Sequelize
    module.exports = db
  })
  .catch((err) => {
    console.error('Unhandled promise rejection:', err)
  })
