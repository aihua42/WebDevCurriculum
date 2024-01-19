import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import errorHandler from "../helpers/errorHandler.mjs";

dotenv.config();

const validateJWT = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    jwt.verify(accessToken, process.env.ACCESS_SECRET);
  } catch (err) {
    return errorHandler(
      401,
      `AccessToken is expired for user ${userId}`,
      err,
      res
    );
  }

  next();
};

export default validateJWT;
