import loadUserData from "../helpers/loadUserData.mjs";
import hasTitle from "../helpers/hasTitle.mjs";
import errorHandler from "../helpers/errorHandler.mjs";
import saveUserData from "../helpers/saveUserData.mjs";

const addText = async (req, res) => {
  const userId = req.params.userId;
  console.log(`Save text from ${userId}`);
  
  try {
    const textList = await loadUserData(userId, "texts", res);
    const { id, title, text } = req.body;

    if (hasTitle(title, textList)) {
      return errorHandler(409, `Error message when addText: Title '${title}' already exists`, null, res);
    }

    const newText = { id, title, text };
    textList.push(newText);

    await saveUserData(textList, userId, "texts", res);
    res.status(201).json({ success: true, message: "Text successfully added!" });
  } catch (err) {
    errorHandler(409, "Failed to response when addText", err, res);
  }
};

export default addText;
