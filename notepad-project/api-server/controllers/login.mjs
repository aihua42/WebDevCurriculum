import errorHandler from "../helpers/errorHandler.mjs";
import createToken from "../helpers/createToken.mjs";
import cookieOptions from "../helpers/cookieOptions.mjs";
import loadDBdata from "../helpers/loadDBdata.mjs";
import comparePW from "../helpers/comparePW.mjs";
import saveToken from "../helpers/saveToken.mjs";
import updateToken from "../helpers/updateToken.mjs";

import jwt from "jsonwebtoken";

const loginSess = async (req, res) => {
  const { userId, pw } = req.body;
  console.log("user id and pw logging in: ", req.body);

  let userData = {};
  try {
    userData = await loadDBdata(userId, "User", res);
  } catch (err) {
    errorHandler(409, 'Error during loading User data in "loginSess" controller', err, res);
    return;
  }

  if (Object.keys(userData).length === 0) {
    errorHandler(204, `${userId} not found, from "loginSess" controller`, null, res);
    return;
  }

  try {
    const checkPW = comparePW(pw, userData.pw);
    if (!checkPW) {
      return errorHandler(
        209,
        'Passwords do not match, from "loginSess" controller',
        null,
        res
      );
    }
  } catch (err) {
    errorHandler(409, 'Error when compare the passwords, from "loginSess" controller', err, res);
    return;
  }

  try {
    req.session.userId = userId;
    req.session.is_logined = true;
    console.log("session: ", req.session);

    res.status(201).json({ success: true, message: "Successfully login within session" });
  } catch (err) {
    errorHandler(204, `${userId} failed to log in, in "loginSess" controller`, err, res);
  }
};

const loginJWT = async (req, res) => {
  const { userId, pw } = req.body;
  console.log("user id and pw logging in: ", req.body);

  let userData = {};
  try {
    userData = await loadDBdata(userId, "User");
  } catch (err) {
    errorHandler(409, 'Error during loading User data in "loginJWT" controller', err, res);
    return;
  }

  if (Object.keys(userData).length === 0) {
    errorHandler(204, `${userId} not found, from "loginJWT" controller`, null, res);
    return;
  }

  try {
    const checkPW = comparePW(pw, userData.pw);
    if (!checkPW) {
      return errorHandler(
        209,
        'Passwords do not match, from "loginJWT" controller',
        null,
        res
      );
    }
  } catch (err) {
    errorHandler(409, 'Error when compare the passwords, from "loginJWT" controller', err, res);
    return;
  }
  
  // findout refreshToken in Token module
  let refreshTokenData = {};
  try {
    refreshTokenData = await loadDBdata(userId, "Token");  // userId: , token: 
  } catch (err) {
    errorHandler(409, 'Failed to load the refreshToken, from "loginJWT" controller', null, res);
    return;
  }

  let refreshToken = '';
  let decodedRefreshToken = {};
  // if there is no refreshToken in the DB, create one
  if (Object.keys(refreshTokenData).length === 0) { 
    refreshToken = createToken(userData, "refresh");

    try {
      const result = await saveToken(userId, refreshToken);
      console.log('result: ', result);

      decodedRefreshToken = userData;
      console.log('RefreshToken is sucessfully created, from "loginJWT"');
    } catch (err) {
      errorHandler(409, 'Failed to create the refreshToken, from "loginJWT" controller', err, res);
      return;
    }
  } else {  
    // check refresh token's validation
    try {
      refreshToken = refreshTokenData.token;
      decodedRefreshToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET
      )
    } catch (err) {
      refreshToken = createToken(userData, "refresh");

      try {
        await updateToken(userId, refreshToken);
        decodedRefreshToken = jwt.decode(refreshToken);
      } catch (err) {
        errorHandler(409, 'Failed to update the refreshToken, from "loginJWT" controller', err, res);
        return;
      }
    }
  }
  console.log('decoded refreshToken to be used when creating accessToken in "loginJWT" :', decodedRefreshToken);

  let accessToken = '';
  try {
    // access token. client에게 전송됨
    const { nickname } = decodedRefreshToken;
    const payload = { userId, nickname, is_logined: true };
    accessToken = createToken(payload, "access");

    await res.cookie("accessToken", accessToken, cookieOptions);
    res.status(201).json({ success: true, message: "Successfully login within JWT" });
  } catch (err) {
    errorHandler(204, `${userId} failed to log in, from "loginJWT" controller`, err, res);
  }
};

export default loginSess;
//export default loginJWT;