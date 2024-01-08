import errorHandler from "../helpers/errorHandler.mjs";
import hasTitle from "../helpers/hasTitle.mjs";
import loadDBdata from "../helpers/loadDBdata.mjs";

import db from "../models/index.js";

const updateText = async (req, res) => {
  const userId = req.params.userId;
  
  try {

    const key = req.params.key;
    const { textId, before, after } = req.body;

    const textDBList = await loadDBdata(userId, 'Text', res);
    if (key === "title" && hasTitle(after, textDBList)) {
      return errorHandler(409, `Title ${after} already exists!`, null, res);
    }
    
    let newObj = {};
    let where = {};
    if (key === 'title') {
      newObj = { textId, title: after };
      where = { userId, title: before }
    } else {
      newObj = { text: after };
      where = { userId, textId };
    }

    await db.Text.sync({ alert: true }).then(() => {
      db.Text.update(newObj, { where }).then((result) => {
        const [updatedRowsCount] = result;

        if (updatedRowsCount > 0) {
          res.status(200).json({ success: true, message: "Successfully updated" });
        } else {
          return errorHandler(500, `Failed to update the ${key} for ${textId}`, err, res);
        }
      })
    }).catch((err) => {
      errorHandler(409, 'Fail to sync the Text DB', err.message, err, res);
    });
  } catch (err) {
    errorHandler(409, "Failed to response PATCH request", err, res);
  }
};

export default updateText;
