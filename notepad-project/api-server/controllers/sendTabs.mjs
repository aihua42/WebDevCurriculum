import loadUserData from "../helpers/loadUserData.mjs";
import errorHandler from "../helpers/errorHandler.mjs";

const sendTabs = async (req, res) => {
  const userId = req.params.userId;

  try {
    const tabs = await loadUserData(userId, "tabs", res);
    const tabsJsonStr = JSON.stringify(tabs);
    const contentLen = Buffer.from(tabsJsonStr).length;

    await res.setHeader("Content-Length", contentLen); // net::ERR_CONNECTION_REFUSED
    res.send(tabs);
  } catch (err) {
    errorHandler(409, "Failed to response GET tabs request", err, res);
  }
};

export default sendTabs;
