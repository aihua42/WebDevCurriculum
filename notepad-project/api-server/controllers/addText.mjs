import hasTitle from "../helpers/hasTitle.mjs";
import errorHandler from "../helpers/errorHandler.mjs";
import addRecord from "../helpers/addRecord.mjs";
import loadDBdata from "../helpers/loadDBdata.mjs";

const addText = async (req, res) => {
  const userId = req.params.userId;

  let textList = [];
  try {
    textList = await loadDBdata(userId, "Text");
  } catch (err) {
    errorHandler(
      409,
      `Error during loading Text data in "addText" controller`,
      err,
      res
    );
    return;
  }

  const { textId, title, text } = req.body;
  if (hasTitle(title, textList)) {
    errorHandler(
      409,
      `Title "${title}" already exists, from "addText" controller`,
      err,
      res
    );
    return;
  }

  const textToAdd = { textId, title, text };
  console.log("Text that being added to Text DB: ", textToAdd);

  try {
    await addRecord(textToAdd, userId, "Text");
    res.status(201).json({ success: true, message: "Text successfully added!" });
  } catch (err) {
    errorHandler(
      409,
      'Failed to add text in "addText" controller...',
      err,
      res
    );
  }
};

export default addText;
