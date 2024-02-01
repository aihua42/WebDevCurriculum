import db from "../../originals/models/index.js";
import errorHandler from "../../originals/helpers/errorHandler.mjs";
import createRecordList from "../../originals/helpers/createRecordList.mjs";

const logoutSess = async (req, res) => {
  console.log("session when logout: ", req.session);
  const userId = req.body.userId;
  if (userId === undefined) {
    errorHandler(
      409,
      'User ID is missing, from "logoutSess" controller',
      null,
      res
    );
    return;
  }
  try {
    await db.Tab.destroy({ where: { userId } });
  } catch (err) {
    errorHandler(
      500,
      'Error during destroy the Tab DB in "logoutSess" controller',
      err,
      res
    );
    return;
  }
  const tabsToSave = req.body;
  try {
    const tabRecordList = createRecordList(tabsToSave, userId);
    await db.Tab.bulkCreate(tabRecordList);
  } catch (err) {
    errorHandler(
      500,
      'Error during bulkCreate the Tab DB in "logoutSess" controller',
      err,
      res
    );
    return;
  }
  req.session.destroy((err) => {
    if (err !== null && err !== undefined) {
      errorHandler(
        500,
        'Failed to destroy the session in "logoutSess" controller',
        err,
        res
      );
    } else {
      res.clearCookie("connect.sid");
      res
        .status(201)
        .json({ success: true, message: "Successfully logout within session" });
    }
  });
};
export default logoutSess;
