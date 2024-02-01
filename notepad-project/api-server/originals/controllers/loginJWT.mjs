import errorHandler from "../../originals/helpers/errorHandler.mjs";
import createToken from "../../originals/helpers/createToken.mjs";
import comparePW from "../../originals/helpers/comparePW.mjs";
import cookieOptions from "../../originals/helpers/cookieOptions.mjs";
import db from "../../originals/models/index.js";

const loginJWT = async (req, res) => {
  const { userId, pw } = req.body;
  console.log("user id and pw logging in: ", req.body);
  // find user data from User DB.
  let userData;
  try {
    userData = await db.User.findOne({ where: { userId } });
    if (userData === null) {
      errorHandler(
        204,
        `${userId} not found, from "loginJWT" controller`,
        null,
        res
      );
      return;
    }
  } catch (err) {
    errorHandler(
      500,
      'Error during loading User data in "loginJWT" controller',
      err,
      res
    );
    return;
  }
  try {
    if (userData.pw === undefined) {
      errorHandler(
        500,
        'Passwords are missing in "loginJWT" controller',
        null,
        res
      );
      return;
    }
    const checkPW = await comparePW(pw, userData.pw);
    if (!checkPW) {
      errorHandler(
        209,
        'Passwords do not match, from "loginJWT" controller',
        null,
        res
      );
      return;
    }
  } catch (err) {
    errorHandler(
      500,
      'Error when compare the passwords, from "loginJWT" controller',
      err,
      res
    );
    return;
  }
  const userDataCloned = JSON.parse(JSON.stringify(userData));
  delete userDataCloned.pw;
  // refresh token은 로그인 성공했을 때 항상 새로 발급
  let refreshToken = "";
  try {
    refreshToken = createToken(userDataCloned, "refresh");
    await db.Token.create({ userId, token: refreshToken });
  } catch (err) {
    errorHandler(
      500,
      'Failed to create the refreshToken, from "loginJWT" controller',
      err,
      res
    );
    return;
  }
  // access token. client에게 전송됨
  try {
    const accessToken = createToken(userDataCloned, "access");
    res.cookie("accessToken", accessToken, cookieOptions);
    res.status(201).send({ success: true, refreshToken });
  } catch (err) {
    errorHandler(
      500,
      `${userId} failed to log in, from "loginJWT" controller`,
      err,
      res
    );
  }
};
export default loginJWT;
