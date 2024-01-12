import db from "../models/index.js";

import errorHandler from "../helpers/errorHandler.mjs";
import createRecordList from "../helpers/createRecordList.mjs";

const logoutSess = async (req, res) => {
  console.log('session when logout: ', req.session);

  const userId = req.body.userId;
  if (!userId) {
    errorHandler(409, 'User ID is missing, from "logoutSess" controller', null, res);
    return;
  }

  try {
    db.Tab.destroy({ where: { userId } });
  } catch (err) {
    errorHandler(409, 'Error during destroy the Tab DB in "logoutSess" controller', err, res);
    return;
  }

  const tabsToSave = req.body;
  try {
    const tabRecordList = createRecordList(tabsToSave, userId);
    await db.Tab.bulkCreate(tabRecordList);
  } catch (err) {
    errorHandler(409, 'Error during bulkCreate the Tab DB in "logoutSess" controller', err, res);
    return;
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

export default logoutSess;