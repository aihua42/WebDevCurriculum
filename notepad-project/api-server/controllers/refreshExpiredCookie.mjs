import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import createToken from "../helpers/createToken.mjs";
import tokenOptions from "../helpers/tokenOptions.mjs";
import errorHandler from "../helpers/errorHandler.mjs";
import loadDBdata from "../helpers/loadDBdata.mjs";

dotenv.config();

const refreshExpiredCookie = async (req, res) => {
  const userId = req.body.userId;

  if (req.cookies["connect.sid"]) {
    console.log("cookies in /auth endpoint: ", req.cookies);

    req.session.regenerate((err) => {
      if (err) {
        return errorHandler(
          403,
          `Session Unauthorized: Failed to refresh the session ID for user ${userId}`,
          err,
          res
        );
      } else {
        return res.json({
          success: true,
          message: "Session ID refreshed successfully",
        });
      }
    });
  } else if (req.cookies["accessToken"]) {
    let refreshTokenData = {};

    try {
      refreshTokenData = await loadDBdata(userId, "Token", res);
    } catch (err) {
      return errorHandler(
        409,
        `Failed to load user ${userId}'s refresh token in '/auth endpoint`,
        err,
        res
      );
    }

    try {
      // check if the refreshToken is expired
      const refreshToken = jwt.verify(
        refreshTokenData.token,
        process.env.REFRESH_SECRET
      );
    } catch (err) {
      return errorHandler(
        409,
        `${userId}'s refreshToken is expired`,
        err,
        res
      );
    }

    try {
      const accessToken = createToken(userId, "access");

      await res.cookie("accessToken", accessToken, tokenOptions);
      res.status(201).json({ success: true, message: "Successfully refresh the access token" });
    } catch (err) {
      errorHandler(
        409,
        `Failed to refresh the access token for user ${userId}`,
        err,
        res
      );
    }
  } else {
    errorHandler(409, `Unknown refresh request from ${userId}`, null, res);
  }
};

export default refreshExpiredCookie;
