import errorHandler from "../helpers/errorHandler.mjs";
import loadDBdata from "../helpers/loadDBdata.mjs";
import addRecode from "../helpers/addRecode.mjs";
import hashPW from "../helpers/hashPW.mjs";

const signup = async (req, res) => {
  const { userId, nickname, pw } = req.body;

  try {
    let userDBdata = await loadDBdata(userId, 'User', res);

    if (Object.keys(userDBdata).length > 0) {
      return errorHandler(209, `${userId} already exists in User DB`, null, res);
    }

    hashPW(pw)
    .then(async (hashedPW) => {
      userDBdata = { userId, nickname, pw: hashedPW };
      await addRecode(userDBdata, userId, 'User', res);

      res.status(201).json({ success: true, message: "Successfully sign up" });
    })
    .catch((err) => {
      errorHandler(500, "Failed to hash the password", err, res);
    });

  } catch (err) {
    errorHandler(500, "Failed to sign up", err, res);
  }
};

export default signup;
