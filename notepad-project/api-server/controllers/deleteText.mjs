import loadUserData from "../helpers/loadUserData.mjs";
import saveUserData from "../helpers/saveUserData.mjs";
import errorHandler from "../helpers/errorHandler.mjs";

const deleteText = async (req, res) => {
  const userId = req.params.userId;

  try {
    const textList = await loadUserData(userId, "texts", res);

    const id = req.params.id;
    const findText = textList.find((ele) => ele.id === id);
    const idx = textList.indexOf(findText);

    if (idx === -1) {
      return res.status(204).json({ success: false, message: "Text not found" });
    }

    try {
      textList.splice(idx, 1);
      await saveUserData(textList, userId, "texts", res);

      res.status(200).json({ success: true, message: "Text successfully deleted" });
    } catch (err) {
      res.status(204).json({ success: false, message: "Text not found" });
    }
  } catch (err) {
    errorHandler(409, "Failed to response when delete text", err, res);
  }
};

export default deleteText;
