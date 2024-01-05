import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import errorHandler from '../helpers/errorHandler.mjs';

dotenv.config();

const varidate = (req, res, next) => {
  if (req.path === '/auth') { 
    return next();
  } 
  
  if (req.cookies['connect.sid']) {  // login, signup 할때는 쿠키 없이 요청이 온다
    const userId = req.params.userId ?? req.body.id; // req.body.id 는 logout 할때 user ID가 body안에 있음.
  
    try {
      if (userId) { // userId가 있을 때 validate 실행. 없으면 라우팅 과정에서 처리
        if (userId !== req.session.userId) {
          return errorHandler(401, 'Session Unauthorized: User ID does NOT match', null, res);
        } 
       
        if (!req.session.is_logined) {
          return errorHandler(401, `Session Unauthorized: : User ${userId} is not logined`, null, res);
        }
      }
    } catch (err) {
      return errorHandler(401, `Session Unauthorized: Failed for user ${userId}`, err, res);
    }
  } else if (req.cookies['accessToken']) { 
    const userId = req.params.userId ?? req.body.id; // req.body.id 는 logout 할때 user ID가 body안에 있음.
   
    try {
      if (userId) {
        const accessToken = req.cookies.accessToken;
        jwt.verify(accessToken, process.env.ACCESS_SECRET);
      }
    } catch (err) {
      return errorHandler(401, `JWT Unauthorized: Failed for user ${userId}`, err, res);
    }
  } 
  
  next();
};

export default varidate;