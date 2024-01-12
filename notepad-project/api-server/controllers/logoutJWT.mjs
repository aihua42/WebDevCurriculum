import dotenv from "dotenv";

import db from "../models/index.js";
import errorHandler from "../helpers/errorHandler.mjs";
import createRecordList from "../helpers/createRecordList.mjs";

dotenv.config();

const logoutJWT = async (req, res) => {
  const userId = req.body.userId;

  if (!userId) {
    errorHandler(409, 'User ID is missing, from "logoutJWT" controller', null, res);
    return;
  }

  try {
    db.Tab.destroy({ where: { userId } });
  } catch (err) {
    errorHandler(409, 'Error during destroy the Tab DB in "logoutJWT" controller', err, res);
    return;
  }

  const tabsToSave = req.body;
  try {
    const tabRecordList = createRecordList(tabsToSave, userId);
    await db.Tab.bulkCreate(tabRecordList);
  } catch (err) {
    errorHandler(409, 'Error during bulkCreate the Tab DB in "logoutJWT" controller', err, res);
    return;
  } 

  try {
    db.Token.destroy({ where: { userId } });  // logout 할때 refresh token도 같이 지워준다

    await res.clearCookie("accessToken");
    res.status(201).json({ success: true, message: "Successfully log out within JWT" });
  } catch (err) {
    errorHandler(409, 'Error during destroy the Token DB in "logoutJWT" controller', err, res);
    return;
  }
  
};

export default logoutJWT;
