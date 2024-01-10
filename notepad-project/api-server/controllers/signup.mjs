import errorHandler from "../helpers/errorHandler.mjs";
import loadDBdata from "../helpers/loadDBdata.mjs";
import addRecord from "../helpers/addRecord.mjs";
import hashPW from "../helpers/hashPW.mjs";

const signup = async (req, res) => {
  const { userId, nickname, pw } = req.body;

  let userData = {};
  try {
    userData = await loadDBdata(userId, "User");
  } catch (err) {
    errorHandler(409, 'Error during loading User data in "signup" controller, ' + err.message, err, res);
    return;
  }

  if (Object.keys(userData).length > 0) {
    errorHandler(209, `${userId} already exists in User DB, from "signup" controller`, null, res);
    return;
  }

  hashPW(pw).then(async (hashedPW) => {
    userData = { userId, nickname, pw: hashedPW };

    try {
      await addRecord(userData, userId, 'User', res);
      res.status(201).json({ success: true, message: "Successfully sign up" });
    } catch (err) {
      errorHandler(409, 'Failed to sign up, from "signup" controller', err, res);
    }
  })
  .catch((err) => {
    errorHandler(500, "Failed to hash the password", err, res);
  });
};

export default signup;
