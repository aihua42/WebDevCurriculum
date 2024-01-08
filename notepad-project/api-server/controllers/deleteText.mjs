import errorHandler from "../helpers/errorHandler.mjs";
import deleteRecode from "../helpers/deleteRecode.mjs";
import loadDBdata from "../helpers/loadDBdata.mjs";

const deleteText = async (req, res) => {
  const userId = req.params.userId;

  try {
    const textId = req.params.textId;

    const userDBtextList = await loadDBdata(userId, 'Text', res);
    const findDBText = userDBtextList.find((ele) => ele.textId === textId);
    const idxDB = userDBtextList.indexOf(findDBText);

    if (idxDB === -1) {
      return res.status(204).json({ success: false, message: "Text not found in Text DB" });
    }

    try {
      await deleteRecode(userId, 'Text', res, textId);
      res.status(200).json({ success: true, message: "Text successfully deleted" });
    } catch (err) {
      res.status(204).json({ success: false, message: "Fail to save the DB data after DELETE text" });
    }
  } catch (err) {
    errorHandler(409, "Failed to response when delete text", err, res);
  }
};

export default deleteText;
