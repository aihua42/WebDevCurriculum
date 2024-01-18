import db from './models/index.js';

import throwError from './throwError.mjs';
import comparePW from './helpers/comparePW.mjs';

const loginSess = async (root, { userId, pw }, { req, res }) => {
  let userData = null;
  try {
    userData = await db.User.findOne({ where: { userId } });
  } catch (err) {
    throwError(500, 'USER_LOADING_FAILED', 'Error during loading User DB in "loginSess"', res);
    return false;
  }

  if (userData === null) {  
    throwError(404, 'USER_NOT_FOUND', `${userId} not found, from "loginSess" resolver`, res);
    return false;
  }

  let checkPW = false;
  try {
    checkPW = comparePW(pw, userData.pw);
  } catch (err) {
    throwError(500, 'PASSWORD_COMPARISON_FAILED', 'Error when compare the passwords, from "loginSess" resolver', res);
    return false;
  }

  if (!checkPW) {
    throwError(409, 'PASSWORD_NOT_MATCH', 'Passwords do not match, from "loginSess" resolver', res);
    return false;
  }

  try {
    const userDataCloned = JSON.parse(JSON.stringify(userData));
    delete userDataCloned.pw;
    userDataCloned.is_logined = true;
    
    req.session.userData = userDataCloned; 
    console.log("session after login: ", req.session);
    return true;
  } catch (err) {
    throwError(500, 'CREATE_SESSION_FAILED', `${userId} failed to log in, in "loginSess" resolver`, res);
    return false;
  }
}

export default loginSess;