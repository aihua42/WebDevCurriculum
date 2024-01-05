import loadUserData from "../helpers/loadUserData.mjs";
import errorHandler from "../helpers/errorHandler.mjs";

const sendText = async (req, res) => {
  const id = req.params.id;
  const userId = req.params.userId;

  try {
    const textList = await loadUserData(userId, "texts", res);
    const findText = textList.find((ele) => ele.id === id);

    if (findText) {
      res.status(200).json(findText);
    } else {
      res.status(204).json({ success: false, message: "Text not found" });
    }
  } catch (err) {
    errorHandler(409, "Failed to response GET user request", err, res);
  }
};

export default sendText;
