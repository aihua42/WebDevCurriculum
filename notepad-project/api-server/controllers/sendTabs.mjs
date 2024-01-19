import errorHandler from "../helpers/errorHandler.mjs";

import db from "../models/index.js";

const sendTabs = async (req, res) => {
  const userId = req.params.userId;

  let tabRecordList = [];
  try {
    tabRecordList = await db.Tab.findAll({ where: { userId } });
  } catch (err) {
    errorHandler(500, 'Error during loading Tab data in "sendTabs" controller', err, res);
    return;
  }

  const tabObj = {};
  tabObj.userId = userId;

  const textList = tabRecordList.map((record) => {
    if (record.active === true) {
      tabObj.activeTitle = record.title;
    }
    return { title: record.title, text: record.text };
  });

  tabObj.tabs = textList;
  res.send(tabObj); 
};

export default sendTabs;
