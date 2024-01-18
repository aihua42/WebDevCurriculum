import db from './models/index.js';

import throwError from "./throwError.mjs";
import createRecordList from "./helpers/createRecordList.mjs";

const logoutSess = async (root, { userId, activeTitle, tabs }, { req, res }) => {
  if (!userId) {
    throwError(409, 'USER_ID_MISSING', 'User ID is missing, from "logoutSess" resolver', res);
    return false;
  }

  try {
    db.Tab.destroy({ where: { userId } });
  } catch (err) {
    throwError(500, 'DELETE_TABS_FAILED', 'Error during destroy the Tab DB in "logoutSess" resolver', res);
    return false;
  }

  try {
    const tabsToSave = { activeTitle, tabs };
    const tabRecordList = createRecordList(tabsToSave, userId);
    await db.Tab.bulkCreate(tabRecordList);
  } catch (err) {
    throwError(500, 'ADD_TABS_FAILED', 'Error during bulkCreate the Tab DB in "logoutSess" resolver', res);
    return false;
  } 
  
  await res.clearCookie("connect.sid"); // 먼저 지우고..., otherwise client한테 먼저 보내지고 지우는 꼴...

  req.session.destroy(async (err) => {
    if (err) {
      throwError(500, 'DELETE_SESSION_FAILED', `Failed to destroy the session in "logoutSess" resolver`, res);
      return false;
    } else {
      return true;
    }
  });
};

export default logoutSess;