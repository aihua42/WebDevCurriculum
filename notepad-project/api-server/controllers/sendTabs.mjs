import errorHandler from "../helpers/errorHandler.mjs";
import loadDBdata from "../helpers/loadDBdata.mjs";

const sendTabs = async (req, res) => {
  const userId = req.params.userId;
  console.log('session when send tabs: ', req.session);

  try {
    const tabs = await loadDBdata(userId, 'Tab', res);
    console.log('tabs loaded from DB: ', tabs);
    
    const tabsJsonStr = JSON.stringify(tabs);
    const contentLen = Buffer.from(tabsJsonStr).length;

    await res.setHeader("Content-Length", contentLen); // net::ERR_CONNECTION_REFUSED
    await res.send(tabs);  // await 안하면 send 되고 setheader가 완료된다...
  } catch (err) {
    errorHandler(409, "Failed to response GET tabs request", err, res);
  }
};

export default sendTabs;
