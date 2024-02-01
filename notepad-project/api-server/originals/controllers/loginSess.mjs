import db from "../../originals/models/index.js";
import errorHandler from "../../originals/helpers/errorHandler.mjs";
import comparePW from "../../originals/helpers/comparePW.mjs";

const loginSess = async (req, res) => {
  const { userId, pw } = req.body;
  console.log("user id and pw logging in: ", req.body);
  // find user data from User DB.
  let userData;
  try {
    userData = await db.User.findOne({ where: { userId } });
    if (userData === null) {
      errorHandler(
        204,
        `${userId} not found, from "loginSess" controller`,
        null,
        res
      );
      return;
    }
  } catch (err) {
    errorHandler(
      500,
      'Error during loading User data in "loginSess" controller',
      err,
      res
    );
    return;
  }
  try {
    if (userData.pw === undefined) {
      errorHandler(
        500,
        'Passwords are missing in "loginSess" controller',
        null,
        res
      );
      return;
    }
    const checkPW = await comparePW(pw, userData.pw);
    if (!checkPW) {
      errorHandler(
        209,
        'Passwords do not match, from "loginSess" controller',
        null,
        res
      );
      return;
    }
  } catch (err) {
    errorHandler(
      500,
      'Error when compare the passwords, from "loginSess" controller',
      err,
      res
    );
    return;
  }
  try {
    const userDataCloned = JSON.parse(JSON.stringify(userData));
    delete userDataCloned.pw;
    userDataCloned.is_logined = true;
    req.session.userData = userDataCloned;
    console.log("session when login: ", req.session);
    res
      .status(201)
      .json({ success: true, message: "Successfully login within session" });
  } catch (err) {
    errorHandler(
      500,
      `${userId} failed to log in, in "loginSess" controller`,
      err,
      res
    );
  }
};
export default loginSess;
