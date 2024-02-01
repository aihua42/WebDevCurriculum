import db from "../../originals/models/index.js";
import errorHandler from "../../originals/helpers/errorHandler.mjs";

const sendText = async (req, res) => {
  const textId = req.params.textId;
  const userId = req.params.userId;
  try {
    const foundText = await db.Text.findOne({ where: { userId, textId } });
    if (foundText === null) {
      res.status(204).json({ success: false, message: "Text not found in DB" });
    } else {
      res.status(200).json(foundText);
    }
  } catch (err) {
    errorHandler(
      500,
      'Error during try to find the text in Text DB, from "sendText" controller',
      err,
      res
    );
  }
};
export default sendText;
