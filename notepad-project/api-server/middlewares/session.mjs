import session from 'express-session';  
import { v4 as uuidv4 } from 'uuid';
import sessionFileStore from 'session-file-store';
import dotenv from 'dotenv';

dotenv.config();

// sesson options
const FileStore = sessionFileStore(session);

const sessMiddleware = session(
  {
    store: new FileStore({ retries: 0 }), // 메모리 아닌 파일에 저장. options 넣음, unless [session-file-store] will retry, error on last attempt: Error: ENOENT, open 'json 파일'
    secret: process.env.SESSION_SECRET, //secretNum  // used to sign the session ID cookie
    genid: (req) => uuidv4(),  // generating session IDs, user 마다 세션 ID 만들어 주기 위해서. 세션 아이디는 브라우저 단위로 저장되고 브라우저 종료시 소멸된다.
    saveUninitialized: false,  // true: uninitialized상태(새로 생성된 session에 아무런 작업이 이루어지지 않은 상황)의 session을 강제로 저장
    resave: false,  // 새로운 요청 시 세션에 변동 사항이 없으면 저장 안함
    cookie: {
      secure: false,  // true: only transmit cookie over https
      httpOnly: true,  // prevents client side JS from reading the cookie
      expires: false, // will be deleted when the user closes their browser
    }
  }
);

export default sessMiddleware;