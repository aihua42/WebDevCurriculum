import errorHandler from "../helpers/errorHandler.mjs";
import createToken from "../helpers/createToken.mjs";
import cookieOptions from "../helpers/cookieOptions.mjs";
import comparePW from "../helpers/comparePW.mjs";

import db from "../models/index.js";

const loginJWT = async (req, res) => {
  const { userId, pw } = req.body;
  console.log("user id and pw logging in: ", req.body);

  // find user data from User DB.
  let userData = {};
  try {
    userData = await db.User.findOne({ where: { userId } });
    if (userData === null) {  
      errorHandler(204, `${userId} not found, from "loginJWT" controller`, null, res);
      return;
    }
  } catch (err) {
    errorHandler(500, 'Error during loading User data in "loginJWT" controller', err, res);
    return;
  }

  try {
    const checkPW = comparePW(pw, userData.pw);
    if (!checkPW) {
      errorHandler(209, 'Passwords do not match, from "loginJWT" controller', null, res);
      return;
    }
  } catch (err) {
    errorHandler(500, 'Error when compare the passwords, from "loginJWT" controller', err, res);
    return;
  }

  const userDataCloned = JSON.parse(JSON.stringify(userData));
  delete userDataCloned.pw;
  
  // refresh token은 로그인 성공했을 때 항상 새로 발급
  let refreshToken = '';
  try {
    refreshToken = createToken(userDataCloned, "refresh");
    await db.Token.create({ userId, token: refreshToken });  // refresh token을 서버 DB에 저장해둔다.
  } catch (err) {
    errorHandler(500, 'Failed to create the refreshToken, from "loginJWT" controller', err, res);
    return;
  }

  // access token. client에게 전송됨
  try {
    const accessToken = createToken(userDataCloned, "access");
    await res.cookie("accessToken", accessToken, cookieOptions); 

    await res.status(201).send({ success: true, refreshToken});  // client에게 refresh token을 보내준다.
  } catch (err) {
    errorHandler(500, `${userId} failed to log in, from "loginJWT" controller`, err, res);
  }
};

export default loginJWT;