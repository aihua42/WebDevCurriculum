import hasTitle from "../helpers/hasTitle.mjs";
import errorHandler from "../helpers/errorHandler.mjs";
import deleteRecord from "../helpers/deleteRecord.mjs";
import loadDBdata from "../helpers/loadDBdata.mjs";

const deleteText = async (req, res) => {
  const { userId, textId } = req.params;

  let textList = [];
  try {
    textList = await loadDBdata(userId, "Text");
  } catch (err) {
    errorHandler(
      409,
      'Error during loading Text data in "deleteText" controller',
      err,
      res
    );
    return;
  }

  if (!hasTitle(textId, textList, "textId")) {
    errorHandler(
      404,
      `Title of textId "${textId}" already exists, from "deleteText" controller`,
      err,
      res
    );
    return;
  }

  try {
    await deleteRecord(userId, "Text", textId);
    res.status(200).json({ success: true, message: "Text successfully deleted" });
  } catch (err) {
    errorHandler(
      409,
      'Failed to delete text in "deleteText" controller...',
      err,
      res
    );
  }
};

export default deleteText;
