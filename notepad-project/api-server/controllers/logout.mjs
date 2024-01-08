import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import errorHandler from "../helpers/errorHandler.mjs";
import deleteRecode from '../helpers/deleteRecode.mjs';
import addRecode from '../helpers/addRecode.mjs';

dotenv.config();

const logoutSess = async (req, res) => {
  const userId = req.session.userId;
  
  if (!userId) {
    return errorHandler(401, 'Unauthorized during logout: User ID is missing', null, res);
  } 

  if (userId !== req.body.userId) {  
    return errorHandler(401, 'Unauthorized during logout: User ID does NOT match', null, res);
  } 

  if (!req.session.is_logined) {
    return errorHandler(401, `Unauthorized during logout: User ${userId} is not logined`, null, res);
  }

  const tabsToSave = req.body;

  try {
    await deleteRecode(userId, 'Tab', res);
  } catch (err) {
    errorHandler(409, "Error during deleting tabs when logout", err, res);
    return;
  }

  try {
    await addRecode(tabsToSave, userId, 'Tab', res);
  } catch (err) {
    errorHandler(409, "Error during adding record when logout", err, res);
    return;
  }

  req.session.destroy(async (err) => {
    if (err) {
      errorHandler(409, 'Failed to destroy the session', err, res);
    } else {
      await res.clearCookie('connect.sid');
      res.status(201).json({ success: true, message: "Successfully logout within session" });
    }
  });
};

const logoutJWT = async (req, res) => {  
  if (!req.body.userId) {
    return errorHandler(401, 'Unauthorized during logout: User ID is missing', null, res);
  } 

  try { 
    const accessToken = req.cookies.accessToken;
    const decodedAccess = jwt.verify(accessToken, process.env.ACCESS_SECRET);

    const userId = decodedAccess.userId;
    const tabsToSave = req.body;

    try {
      await deleteRecode(userId, 'Tab', res);
    } catch (err) {
      errorHandler(409, "Error during deleting tabs when logout", err, res);
      return;
    }

    try {
      await addRecode(tabsToSave, userId, 'Tab', res);
    } catch (err) {
      errorHandler(409, "Error during adding record when logout", err, res);
      return;
    }
    
    try {
      await deleteRecode(userId, 'Token', res);
      await res.clearCookie('accessToken');

      res.status(201).json({ success: true, message: 'Successfully log out within JWT' });
    } catch (err) {
      errorHandler(409, "Failed to save tabs user sent tabs OR clear tokens", err, res);
    }
  } catch(err) {
    errorHandler(401, "Failed to authenticate access token when log out", err, res);
  }
};

//export default logoutSess;
export default logoutJWT;