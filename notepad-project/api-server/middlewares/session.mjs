import session from 'express-session';  
import { v4 as uuidv4 } from 'uuid';
import SequelizeStore from 'connect-session-sequelize';
import dotenv from 'dotenv';
import db from '../models/index.js';
import cookieOptions from '../helpers/cookieOptions.mjs';

dotenv.config();

const { sequelize } = db;  

const SequelizeSessionStore = SequelizeStore(session.Store); 
const store = new SequelizeSessionStore({
  db: sequelize,
  tableName: `Sess`,
  
  freezeTableName: true,
  timestamps: false,
}); 

const sessMiddleware = session(
  {
    store: store, 
    secret: process.env.SESSION_SECRET, //secretNum  // used to sign the session ID cookie
    genid: (req) => uuidv4(),  // generating session IDs, user 마다 세션 ID 만들어 주기 위해서. 세션 아이디는 브라우저 단위로 저장되고 브라우저 종료시 소멸된다.
    saveUninitialized: false,  // true: uninitialized상태(새로 생성된 session에 아무런 작업이 이루어지지 않은 상황)의 session을 강제로 저장
    resave: false,  // 새로운 요청 시 세션에 변동 사항이 없으면 저장 안함
    cookie: cookieOptions
  }
);

store.sync({ alter: true });

export default sessMiddleware;