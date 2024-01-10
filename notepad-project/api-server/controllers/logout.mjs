import dotenv from "dotenv";
import jwt from 'jsonwebtoken';

import errorHandler from "../helpers/errorHandler.mjs";
import deleteRecord from "../helpers/deleteRecord.mjs";
import addRecord from "../helpers/addRecord.mjs";

dotenv.config();

const logoutSess = async (req, res) => {
  console.log('session when logout: ', req.session);
  const userId = req.session.userId;

  if (!userId) {
    errorHandler(
      409,
      'User ID is missing, from "logoutSess" controller',
      null,
      res
    );
    return;
  }

  if (userId !== req.body.userId) {
    errorHandler(
      409,
      `User ID does NOT match in "logoutSess" controller`,
      null,
      res
    );
    return;
  }

  if (!req.session.is_logined) {
    errorHandler(
      500,
      `User ${userId} is not logined, from "logoutSess"`,
      null,
      res
    );
    return;
  }

  const tabsToSave = req.body;

  let toSaveTabs = true;
  if (tabsToSave.tabs.length === 0) {  // 비정상 로그아웃 회원, refresh token expired 됐을 때
    toSaveTabs = false;
  }

  if (tabsToSave.activeTitle === 'welcomeText') {
    toSaveTabs = false;
  }
  console.log('here');
  if (toSaveTabs) { console.log('there');
    try {
      await deleteRecord(userId, "Tab", res);
    } catch (err) {
      console.log('No Tab data to delete before saving in "logoutJWT"');
    }
  
    try {
      await addRecord(tabsToSave, userId, "Tab", res);
    } catch (err) {
      errorHandler(409, 'Error during adding tabs, from "logoutSess" controller', err, res);
      return;
    }
  }

  req.session.destroy(async (err) => {
    if (err) {
      errorHandler(409, `Failed to destroy the session in "logoutSess" controller`, err, res);
    } else {
      await res.clearCookie("connect.sid");
      res.status(201).json({ success: true, message: "Successfully logout within session" });
    }
  });
};

const logoutJWT = async (req, res) => {
  const userId = req.body.userId;

  if (!userId) {
    errorHandler(
      409,
      'User ID is missing, from "logoutJWT" controller',
      null,
      res
    );
    return;
  }
  
  const accessToken = jwt.decode(req.cookies.accessToken);
  console.log('accessToken when logoutJWT: ', accessToken);

  if (!accessToken) {
    errorHandler(400, 'Access token is missing, from "logoutJWT" controller', null, res);
    return;
  }

  if (userId !== accessToken.userId) {
    errorHandler(
      409,
      'User ID does NOT match, from "logoutJWT" controller',
      null,
      res
    );
    return;
  }

  if (!accessToken.is_logined) {
    errorHandler(
      500,
      'User is already logout, from "logoutJWT" controller',
      null,
      res
    );
    return;
  }

  const tabsToSave = req.body;

  if (tabsToSave.tabs.length === 0) {  // 비정상 로그아웃 회원, refresh token expired 됐을 때
    await res.clearCookie("accessToken");
    res.status(201).json({ success: true, message: "Successfully log out within JWT" });

    return;
  }

  if (tabsToSave.activeTitle === 'welcomeText') {
    await res.clearCookie("accessToken");
    res.status(201).json({ success: true, message: "Successfully log out within JWT" });

    return;
  }

  try {
    await deleteRecord(userId, "Tab");
  } catch (err) {
    console.log('No Tab data to delete before saving in "logoutJWT"');
  }

  try {
    await addRecord(tabsToSave, userId, "Tab");
  } catch (err) {
    errorHandler(
      409,
      'Error during saving tabs, from "logoutJWT" controller',
      err,
      res
    );
    return;
  }

  await res.clearCookie("accessToken");
  res.status(201).json({ success: true, message: "Successfully log out within JWT" });
};

export default logoutSess;
//export default logoutJWT;
