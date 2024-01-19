import errorHandler from "../helpers/errorHandler.mjs";
import hashPW from "../helpers/hashPW.mjs";

import db from "../models/index.js";

const signup = async (req, res) => {
  const { userId, nickname, pw } = req.body;

  try {
    const userFound = await db.User.findOne({ where: { userId } });
    if (userFound) {  // if find nothing matches, return null;
      errorHandler(209, `${userId} already exists in User DB, from "signup" controller`, null, res);
      return;
    }
  } catch (err) {
    errorHandler(500, 'Error during loading User data in "signup" controller, ' + err.message, err, res);
    return;
  }

  hashPW(pw).then(async (hashedPW) => {
    const userData = { userId, nickname, pw: hashedPW };

    try {
      await db.User.create(userData);
      res.status(201).json({ success: true, message: "Successfully sign up" });
    } catch (err) {
      errorHandler(500, 'Failed to sign up, from "signup" controller', err, res);
    }
  })
  .catch((err) => {
    errorHandler(500, "Failed to hash the password", err, res);
  });
};

export default signup;
