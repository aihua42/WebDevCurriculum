import fs from "fs/promises";
import path from "path";
import getPath from "../common-functions/getPath.mjs";

const separator = "controllers";
const serverPath = getPath(import.meta.url, separator);

const sendBeforeLogoutData = (req, res) => {
  const indexPath = path.join(serverPath, "views", "index.html");

  if (!req.session.is_logined) {
    res.sendFile(indexPath);
    return;
  }

  const userId = req.session.userId;
  const id = req.params.id;

  if (id !== userId) {
    console.log("id and userId do not match: ", [id, userId]);

    res.status(409).json({ success: false, message: "User id does NOT match" });
    return;
  }

  const userPath = path.join(serverPath, "users", `${userId}.json`);
  
  fs.readFile(userPath)
    .then(async (file) => {
      const userData = JSON.parse(file);
      const data = userData.data;

      if (data) {
        const dataStr = JSON.stringify(data);
        const contentLen = Buffer.from(dataStr).length;
        console.log("content length: ", contentLen);

        res.setHeader("Content-Length", contentLen); // net::ERR_CONNECTION_REFUSED
        res.send(data);
      } else {
        console.log(`${id} is new!`);
        res.sendFile(indexPath);
      }
    })
    .catch((err) => {
      res.status(404).json({ success: false, message: "User file not found" });
    });
};

export default sendBeforeLogoutData;
