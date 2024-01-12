import errorHandler from "../helpers/errorHandler.mjs";

import db from "../models/index.js";

const sendTabs = async (req, res) => {
  const userId = req.params.userId;

  let tabRecordList = [];
  try {
    tabRecordList = await db.Tab.findAll({ where: { userId } });
  } catch (err) {
    errorHandler(409, 'Error during loading Tab data in "sendTabs" controller', err, res);
    return;
  }

  const tabObj = {};
  tabObj.userId = userId;
  const textList = [];
  
  tabRecordList.forEach((obj) => {
    if (obj) {
      textList.push({ title: obj.title, text: obj.text });
      if (obj.active === true) {
        tabObj.activeTitle = obj.title;
      }
    }
  });

  tabObj.tabs = textList;

  try {
    const tabJsonStr = JSON.stringify(tabRecordList);
    const contentLen = Buffer.from(tabJsonStr).length;

    await res.setHeader("Content-Length", contentLen); // net::ERR_CONNECTION_REFUSED
    await res.send(tabObj);  // await 안하면 send 된후 setheader가 완료된다...
  } catch (err) {
    errorHandler(409, 'Failed to load tabs in "sendTabs" controller', err, res);
  }
};

export default sendTabs;
