import errorHandler from "../helpers/errorHandler.mjs";
import loadDBdata from "../helpers/loadDBdata.mjs";

const sendTabs = async (req, res) => {
  const userId = req.params.userId;

  let tabs = {};
  try {
    tabs = await loadDBdata(userId, 'Tab');
  } catch (err) {
    errorHandler(409, 'Error during loading Tab data in "sendTabs" controller', err, res);
    return;
  }

  try {
    const tabsJsonStr = JSON.stringify(tabs);
    const contentLen = Buffer.from(tabsJsonStr).length;

    await res.setHeader("Content-Length", contentLen); // net::ERR_CONNECTION_REFUSED
    await res.send(tabs);  // await 안하면 send 된후 setheader가 완료된다...
  } catch (err) {
    errorHandler(409, 'Failed to load tabs in "sendTabs" controller', err, res);
  }
};

export default sendTabs;
