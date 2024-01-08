import bcrypt from 'bcrypt';

import errorHandler from "../helpers/errorHandler.mjs";

const comparePW = async (pw, hashedpw) => {
  try {
    const passwordMatches = await bcrypt.compare(pw, hashedpw);

    if (passwordMatches) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    errorHandler(204, 'Fail to compare the password', err, res);
    return false;
  }
};

export default comparePW;