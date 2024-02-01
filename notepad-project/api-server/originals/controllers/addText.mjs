import isInTextList from '../../originals/helpers/isInTextList.mjs';
import errorHandler from "../../originals/helpers/errorHandler.mjs";
import db from '../../originals/models/index.js';

const addText = async (req, res) => {
  const userId = req.params.userId;
  let textList = [];
  try {
    textList = await db.Text.findAll({ where: { userId } });
  } catch (err) {
    errorHandler(
      500,
      'Error during loading Text data in "addText" controller',
      err,
      res
    );
    return;
  }
  const { textId, title, text } = req.body;
  if (isInTextList(title, textList)) {
    errorHandler(
      409,
      `Title "${title}" already exists, from "addText" controller`,
      null,
      res
    );
    return;
  }
  const textToAdd = { userId, textId, title, text };
  try {
    await db.Text.create(textToAdd);
    res
      .status(201)
      .json({ success: true, message: "Text successfully added!" });
  } catch (err) {
    errorHandler(
      500,
      'Failed to add text in "addText" controller...',
      err,
      res
    );
  }
};
export default addText;
