import db from './models/index.js';

import throwError from "./throwError.mjs";
import createRecordList from "./helpers/createRecordList.mjs";

const logoutJWT = async (root, { userId, activeTitle, tabs }, { req, res }) => {
  if (!userId) {
    throwError(409, 'USER_ID_MISSING', 'User ID is missing, from "logoutJWT" resolver', res);
    return false;
  }

  try {
    db.Tab.destroy({ where: { userId } });
  } catch (err) {
    throwError(500, 'DELETE_TABS_FAILED', 'Error during destroy the Tab DB in "logoutJWT" resolver', res);
    return false;
  }

  try {
    const tabsToSave = { activeTitle, tabs };
    const tabRecordList = createRecordList(tabsToSave, userId);
    await db.Tab.bulkCreate(tabRecordList);
  } catch (err) {
    throwError(500, 'ADD_TABS_FAILED', 'Error during bulkCreate the Tab DB in "logoutJWT" resolver', res);
    return false;
  } 

  try {
    db.Token.destroy({ where: { userId } }); 
    await res.clearCookie("accessToken");
    return true;
  } catch (err) {
    throwError(500, 'DELETE_TOKEN_FAILED', 'Error during destroy the Token DB in "logoutJWT" resolver', res);
    return false;
  }
};

export default logoutJWT;