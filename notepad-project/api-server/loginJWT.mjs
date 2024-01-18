import db from './models/index.js';

import throwError from './throwError.mjs';
import comparePW from './helpers/comparePW.mjs';
import createToken from './helpers/createToken.mjs';
import cookieOptions from './helpers/cookieOptions.mjs';

const loginJWT = async (root, { userId, pw }, { req, res }) => {
  console.log('User data when login: ', { userId, pw });

  let userData = null;
  try {
    userData = await db.User.findOne({ where: { userId } });
  } catch (err) {
    throwError(500, 'USER_LOADING_FAILED', 'Error during loading User DB in "loginJWT"', res);
    return {};
  }

  if (userData === null) {  
    throwError(404, 'USER_NOT_FOUND', `${userId} not found, from "loginJWT" resolver`, res);
    return {};
  }

  let checkPW = false;
  try {
    checkPW = comparePW(pw, userData.pw);
  } catch (err) {
    throwError(500, 'PASSWORD_COMPARISON_FAILED', 'Error when compare the passwords, from "loginSess" resolver', res);
    return {};
  }

  if (!checkPW) {
    throwError(409, 'PASSWORD_NOT_MATCH', 'Passwords do not match, from "loginSess" resolver', res);
    return {};
  }

  const userDataCloned = JSON.parse(JSON.stringify(userData));
  delete userDataCloned.pw;

  let refreshToken = '';
  try {
    refreshToken = createToken(userDataCloned, "refresh");  
    await db.Token.create({ userId, token: refreshToken }); 
  } catch (err) {
    throwError(500, 'CREATE_REFRESHTOKEN_FAILED', 'Failed to create the refreshToken, from "loginJWT" resolver', res);
    return {};
  }

  try {
    const accessToken = createToken(userDataCloned, "access");

    await res.cookie("accessToken", accessToken, cookieOptions);   
    //console.log('res cookies after loginJWT: ', res.getHeaders());
    
    return { refreshToken };  // let client add to the header
  } catch (err) {
    throwError(500, 'CREATE_ACCESSTOKEN_FAILED', 'Failed to create the accessToken, from "loginJWT" resolver', res);
    return {};
  }
}

export default loginJWT;