import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import createToken from "../helpers/createToken.mjs";
import cookieOptions from "../helpers/cookieOptions.mjs";
import errorHandler from "../helpers/errorHandler.mjs";
import loadDBdata from "../helpers/loadDBdata.mjs";

dotenv.config();

const refreshExpiredCookie = async (req, res) => {
  const userId = req.body.userId;

  if (req.cookies["connect.sid"]) {
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
    // findout refreshToken in Token module
    let refreshTokenData = {};
    try {
      refreshTokenData = await loadDBdata(userId, "Token");  // userId: , token: 
    } catch (err) {
      errorHandler(409, 'Failed to load the refreshToken, from "refreshExpiredCookie" controller', null, res);
      return;
    }

    let decodedRefreshToken = {};

    // check refresh token's validation
    try {
      const refreshToken = refreshTokenData.token;
      decodedRefreshToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET
      );
    } catch (err) {
      errorHandler(403, 'RefreshToken is expired, from "refreshExpiredCookie" controller', err, res);
      return;
    }

    // refresh the access token
    const payload = JSON.parse(JSON.stringify(decodedRefreshToken));
    delete payload.pw;
    payload.is_logined = true;

    const accessToken = createToken(payload, "access");
    await res.cookie("accessToken", accessToken, cookieOptions);
    res.status(201).json({
        success: true,
        message: "Successfully refresh the access token",
      });
  } else {
    errorHandler(409, `Unknown request of refreshing cookie from ${userId}, in "refreshExpiredCookie" controller`, null, res);
  }
};

export default refreshExpiredCookie;
