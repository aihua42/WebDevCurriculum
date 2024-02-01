import errorHandler from "../../originals/helpers/errorHandler.mjs";
import db from "../../originals/models/index.js";

const sendTabs = async (req, res) => {
  const userId = req.params.userId;
  let tabRecordList = [];
  try {
    tabRecordList = await db.Tab.findAll({ where: { userId } });
  } catch (err) {
    errorHandler(
      500,
      'Error during loading Tab data in "sendTabs" controller',
      err,
      res
    );
    return;
  }
  let activeTitle;
  const textList = tabRecordList.map((record) => {
    if (record.active) {
      activeTitle = record.title;
    }
    return { title: record.title, text: record.text };
  });
  if (activeTitle === undefined) {
    errorHandler(
      500,
      'Active title is missing in "sendTabs" controller',
      null,
      res
    );
    return;
  }
  const tabObj = { userId, activeTitle, tabs: textList };
  res.send(tabObj);
};
export default sendTabs;
