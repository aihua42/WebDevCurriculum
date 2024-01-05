import loadUserData from "../helpers/loadUserData.mjs";
import errorHandler from "../helpers/errorHandler.mjs";
import saveUserData from "../helpers/saveUserData.mjs";

const signup = async (req, res) => {
  const { id, nickname, pw } = req.body;

  try {
    let userData = await loadUserData(id, "users", res);

    if (Object.keys(userData).length > 0) {
      return errorHandler(209, `${id} already exists`, null, res);
    }

    userData = { id, nickname, pw };
    console.log('user trys to sign up: ', userData);

    await saveUserData(userData, id, "users", res);
    res.status(201).json({ success: true, message: "Successfully sign up" });
  } catch (err) {
    errorHandler(500, "Failed to sign up", err, res);
  }
};

export default signup;
