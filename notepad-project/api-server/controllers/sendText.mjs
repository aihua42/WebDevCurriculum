import db from "../models/index.js";

const sendText = async (req, res) => {
  const textId = req.params.textId;
  const userId = req.params.userId;

  await db.Text.findOne({ where: { userId, textId }}).then((foundText) => {
    if (foundText === null) {
      res.status(204).json({ success: false, message: "Text not found in DB" });
    } else {
      res.status(200).json(foundText);
    }
  }).catch((err) => {
    res.status(204).json({ success: false, message: "Text not found in DB" });
  });
};

export default sendText;
