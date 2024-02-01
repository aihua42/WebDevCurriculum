import dotenv from "dotenv";
import db from "../../originals/models/index.js";
import errorHandler from "../../originals/helpers/errorHandler.mjs";
import createRecordList from "../../originals/helpers/createRecordList.mjs";

dotenv.config();
const logoutJWT = async (req, res) => {
  const userId = req.body.userId;
  if (userId === undefined) {
    errorHandler(
      409,
      'User ID is missing, from "logoutJWT" controller',
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
      'Error during destroy the Tab DB in "logoutJWT" controller',
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
      'Error during bulkCreate the Tab DB in "logoutJWT" controller',
      err,
      res
    );
    return;
  }
  try {
    await db.Token.destroy({ where: { userId } });
    res.clearCookie("accessToken");
    res
      .status(201)
      .json({ success: true, message: "Successfully log out within JWT" });
  } catch (err) {
    errorHandler(
      500,
      'Error during destroy the Token DB in "logoutJWT" controller',
      err,
      res
    );
  }
};
export default logoutJWT;
