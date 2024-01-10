import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import errorHandler from '../helpers/errorHandler.mjs';

dotenv.config();

const valiate = (req, res, next) => {
  const userId = req.params.userId;
  if (!userId) {
    return errorHandler(401, 'Unauthorized: User ID is missing', null, res);
  }  
  
  if (req.cookies['connect.sid']) {  
    
    if (userId !== req.session.userId) {  
      return errorHandler(401, 'Session Unauthorized - User ID does NOT match', null, res);
    } 

    if (!req.session.is_logined) {
      return errorHandler(401, `Session Unauthorized: - User ${userId} is not logined`, null, res);
    }
  } else if (req.cookies['accessToken']) { 
    try {
      const accessToken = req.cookies.accessToken;
      jwt.verify(accessToken, process.env.ACCESS_SECRET);
    } catch (err) {
      return errorHandler(401, `AccessToken is expired for user ${userId}`, err, res);
    }
  } else {
    return errorHandler(409, `Unknown cookie from ${userId}`, null, res);
  }
  
  next();
};

export default valiate;