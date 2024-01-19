import errorHandler from "../helpers/errorHandler.mjs";

import db from "../models/index.js";

const updateText = async (req, res) => {
  const userId = req.params.userId;
  const key = req.params.key;
  const { textId, before, after } = req.body;

  let textList = [];
  try {
    textList = await db.Text.findAll({ where: { userId } });
  } catch (err) {
    errorHandler(
      500,
      'Error during loading Text data in "updateText" controller',
      err,
      res
    );
    return;
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

  try {
    const [affectedRows] = await db.Text.update(newObj, { where });

    if (affectedRows > 0) {
      res.status(200).json({ success: true, message: "Successfully updated" });
    } else {
      errorHandler(209, `Nothing changed when updating the ${key} of text id - ${textId}, from "updateText" controller`, err, res);
    }
  } catch (err) {
    errorHandler(500, 'Error during try to update the text in Text DB, from "updateText" controller', err, res);
  }
};

export default updateText;
