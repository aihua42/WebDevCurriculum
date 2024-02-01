import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import errorHandler from "../../originals/helpers/errorHandler.mjs";
dotenv.config();
const validateJWT = (req, res, next) => {
  try {
    if (
      process.env.ACCESS_SECRET === null ||
      process.env.ACCESS_SECRET === undefined
    ) {
      errorHandler(500, "Secret key is missing", null, res);
      return;
    }
    const accessToken = req.cookies.accessToken;
    if (accessToken === null || accessToken === undefined) {
      errorHandler(401, "AccessToken is missing", null, res);
      return;
    }
    jwt.verify(accessToken, process.env.ACCESS_SECRET);
  } catch (err) {
    errorHandler(401, "AccessToken is expired", err, res);
    return;
  }
  next();
};
export default validateJWT;
