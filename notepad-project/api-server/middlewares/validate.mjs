import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import errorHandler from '../helpers/errorHandler.mjs';

dotenv.config();

const varidate = (req, res, next) => {
  const userId = req.params.userId;
  if (!userId) {
    return errorHandler(401, 'Unauthorized: User ID is missing', null, res);
  }  
  
  if (req.cookies['connect.sid']) {  
    //console.log('session to check varidation: ', req.session);
    
    if (userId !== req.session.userId) {  
      return errorHandler(401, 'Session Unauthorized: User ID does NOT match', null, res);
    } 

    if (!req.session.is_logined) {
      return errorHandler(401, `Session Unauthorized: : User ${userId} is not logined`, null, res);
    }
  } else if (req.cookies['accessToken']) { 
    //console.log('access token to check varidation: ', req.session);
   
    try {
      const accessToken = req.cookies.accessToken;
      jwt.verify(accessToken, process.env.ACCESS_SECRET);
    } catch (err) {
      return errorHandler(401, `JWT Unauthorized: Failed for user ${userId}`, err, res);
    }
  } else {
    return errorHandler(401, `Unauthorized: Missing the cookie from ${userId}`, err, res);
  }
  
  next();
};

export default varidate;