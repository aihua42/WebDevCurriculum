import jwt from 'jsonwebtoken';
import path from 'path';
import { unlink } from 'fs/promises';
import dotenv from 'dotenv';

import errorHandler from "../helpers/errorHandler.mjs";
import saveUserData from "../helpers/saveUserData.mjs";

dotenv.config();

const logoutSess = async (req, res) => {
  const userId = req.session.userId;
  
  if (!userId) {
    return errorHandler(401, 'Unauthorized during logout: User ID is missing', null, res);
  } 

  if (userId !== req.body.id) {  
    return errorHandler(401, 'Unauthorized during logout: User ID does NOT match', null, res);
  } 

  if (!req.session.is_logined) {
    return errorHandler(401, `Unauthorized during logout: User ${userId} is not logined`, null, res);
  }

  req.session.destroy(async (err) => {
    if (err) {
      errorHandler(409, 'Failed to destroy the session', err, res);
    } else {
      const tabsToSave = req.body.tabs;

      try {
        await saveUserData(tabsToSave, userId, "tabs", res);

        res.clearCookie('connect.sid');
        res.status(201).json({ success: true, message: "Successfully logout within session" });
      } catch (err) {
        errorHandler(409, "Failed to save tabs user sent tabs within session", err, res);
      }
    }
  });
};

const logoutJWT = async (req, res) => {  
  if (!req.body.id) {
    return errorHandler(401, 'Unauthorized during logout: User ID is missing', null, res);
  } 

  try { 
    const accessToken = req.cookies.accessToken;
    const decodedAccess = jwt.verify(accessToken, process.env.ACCESS_SECRET);

    const userId = decodedAccess.userId;
    const tabsToSave = req.body.tabs;
    
    try {
      const tokenPath = path.join('tokens', `${userId}.json`); 
      await unlink(tokenPath);
      await saveUserData(tabsToSave, userId, "tabs", res);

      await res.clearCookie('accessToken');
      res.status(201).json({ success: true, message: 'Successfully log out within JWT' });
    } catch (err) {
      errorHandler(409, "Failed to save tabs user sent tabs OR clear tokens", err, res);
    }
  } catch(err) {
    errorHandler(405, "Failed to authenticate access token when log out", err, res);
  }
};

export default logoutSess;
//export default logoutJWT;