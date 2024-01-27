import { type Sequelize, type Model, type BuildOptions } from 'sequelize'

interface TabRecord {
  userId: string
  active: boolean
  title: string
  text: string
}

interface TabInstance extends Model<TabRecord>, TabRecord {}
type TabModel = typeof Model & (new (values?: object, options?: BuildOptions) => TabInstance)

interface Tabs {
  userId: string
  activeTitle: string
  tabs: Array<{ title: string, text: string }> | []
}

interface TextRecord {
  userId: string
  textId: string
  title: string
  text: string
}

interface TextInstance extends Model<TextRecord>, TextRecord {}
type TextModel = typeof Model & (new (values?: object, options?: BuildOptions) => TextInstance)

interface UserAttributes {
  id?: number
  userId: string
  nickname: string
  pw?: string
  is_logined?: boolean
}

interface UserInstance extends Model<UserAttributes>, UserAttributes {}
type UserModel = typeof Model & (new (values?: object, options?: BuildOptions) => UserInstance)

interface SessAttributes {
  sid: string
  data: Record<string, any>
}

interface SessInstance extends Model<SessAttributes>, SessAttributes {}
type SessModel = typeof Model & (new (values?: object, options?: BuildOptions) => SessInstance)

interface TokenAttributes {
  userId: string
  token: string
}

interface TokenInstance extends Model<TokenAttributes>, TokenAttributes {}
type TokenModel = typeof Model & (new (values?: object, options?: BuildOptions) => TokenInstance)

type ModelType = TabModel | TextModel | UserModel | SessModel | TokenModel

interface DB {
  Sequelize?: typeof Sequelize
  sequelize?: Sequelize
  User?: UserModel
  Text?: TextModel
  Tab?: TabModel
  Sess?: SessModel
  Token?: TokenModel
  [key: string]: any
}

interface Config {
  username: string
  password: string
  database: string
  host: string
  dialect: string
  logging: boolean
}

interface Cookie {
  maxAge?: number
  signed?: boolean
  expires?: boolean | Date
  httpOnly?: boolean
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: 'strict' | 'lax' | 'none'
}

export type {
  TabRecord,
  Tabs,
  TabInstance,
  TabModel,
  TextRecord,
  TextInstance,
  TextModel,
  UserAttributes,
  UserInstance,
  UserModel,
  SessAttributes,
  SessInstance,
  SessModel,
  TokenAttributes,
  TokenInstance,
  TokenModel,
  Config,
  ModelType,
  DB,
  Cookie
}
