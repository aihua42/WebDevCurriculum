import hasTitle from "../helpers/hasTitle.mjs";
import errorHandler from "../helpers/errorHandler.mjs";
import addRecode from "../helpers/addRecode.mjs";
import loadDBdata from "../helpers/loadDBdata.mjs";

const addText = async (req, res) => {
  const userId = req.params.userId;
  console.log(`Saving text from ${userId}'s POST METHOD...`);
  
  try {
    const { textId, title, text } = req.body;

    const userDBtextList = await loadDBdata(userId, 'Text', res);  

    if (hasTitle(title, userDBtextList)) {
      return errorHandler(409, `Error message when addText: Title '${title}' already exists`, null, res);
    }

    const newDBText = { textId, title, text };
    console.log('new Text from user that adding to Text DB: ', newDBText);

    await addRecode(newDBText, userId, 'Text', res);

    res.status(201).json({ success: true, message: "Text successfully added!" });
  } catch (err) {
    errorHandler(409, "Failed to addText.........", err, res);
  }
};

export default addText;
