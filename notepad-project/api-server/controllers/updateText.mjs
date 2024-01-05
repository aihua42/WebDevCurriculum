import loadUserData from "../helpers/loadUserData.mjs";
import errorHandler from "../helpers/errorHandler.mjs";
import hasTitle from "../helpers/hasTitle.mjs";
import saveUserData from "../helpers/saveUserData.mjs";

const updateText = async (req, res) => {
  const userId = req.params.userId;

  try {
    const textList = await loadUserData(userId, "texts", res);

    const key = req.params.key;
    const { id, before, after } = req.body;

    if (key === "title" && hasTitle(after, textList)) {
      return errorHandler(409, `Title ${after} already exists!`, null, res);
    }

    let isUpdated = false;
    textList.forEach((obj) => {
      if (key === "title" && obj.title === before) {
        isUpdated = true;
        obj.id = id;
        obj.title = after;
      } else if (key === "text" && obj.id === id) {
        isUpdated = true;
        obj.text = after;
      }
    });

    if (!isUpdated) {
      return errorHandler(404, "Nothing to update", null, res);
    }

    try {
      await saveUserData(textList, userId, "texts", res);
      res.status(200).json({ success: true, message: "Successfully updated" });
    } catch (err) {
      errorHandler(500, "Failed to save the data in PATCH", err, res);
    }
  } catch (err) {
    errorHandler(409, "Failed to response PATCH request", err, res);
  }
};

export default updateText;
