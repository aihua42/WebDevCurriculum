import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import errorHandler from "../helpers/errorHandler.mjs";

dotenv.config();

const validateJWT = (req, res, next) => {
  const userId = req.params.userId;
  
  if (!userId) {
    return errorHandler(409, 'User ID is missing in "validateJWT" middleware', null, res);
  }

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
