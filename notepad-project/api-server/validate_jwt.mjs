import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import throwError from "./throwError.mjs";

dotenv.config();

const validate_jwt = (req, res) => {
  try {
    const accessToken = req.cookies.accessToken;
    jwt.verify(accessToken, process.env.ACCESS_SECRET);
  } catch (err) {
    throwError(401, 'Unauthorized_USER', `AccessToken is expired`, res);
  }
};

export default validate_jwt;
