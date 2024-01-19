import isInTextList from "../helpers/isInTextDB.mjs";
import errorHandler from "../helpers/errorHandler.mjs";

import db from "../models/index.js";

const deleteText = async (req, res) => {
  const { userId, textId } = req.params;

  let textList = [];
  try {
    textList = await db.Text.findAll({ where: { userId } });
  } catch (err) {
    errorHandler(
      500,
      'Error during loading Text data in "deleteText" controller',
      err,
      res
    );
    return;
  }

  if (!isInTextList(textId, textList, "textId")) {
    errorHandler(
      404,
      `Title of textId "${textId}" does NOT exist, from "deleteText" controller`,
      err,
      res
    );
    return;
  }

  try {
    await db.Text.destroy({ where: { userId, textId } });

    res.status(200).json({ success: true, message: "Text successfully deleted" });
  } catch (err) {
    errorHandler(
      500,
      'Failed to delete text in "deleteText" controller...',
      err,
      res
    );
  }
};

export default deleteText;
