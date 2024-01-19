import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import createToken from "../helpers/createToken.mjs";
import cookieOptions from "../helpers/cookieOptions.mjs";
import errorHandler from "../helpers/errorHandler.mjs";

import db from "../models/index.js";

dotenv.config();

const refreshAccessToken = async (req, res) => {
  const userId = req.body.userId;
  const refreshToken = req.body.refreshToken;

  // check refresh token's validation
  let payload = {};
  try {
    payload = jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET
    );
  } catch (err) {
    errorHandler(
      403,
      'RefreshToken is expired, from "refreshAccessToken" controller',
      err,
      res
    );
    return;
  }
  console.log('payload to be used in "refreshAccessToken" controller: ', payload);
  
  // find out refreshToken in Token module
  let refreshTokenData = {};
  try {
    refreshTokenData = await db.Token.findOne({ where: { userId } }); // userId: , token:
    if (refreshTokenData === null) {
      errorHandler(
        403,
        'RefreshToken is missing in DB, from "refreshAccessToken" controller',
        null,
        res
      );
      return;
    }
  } catch (err) {
    errorHandler(
      500,
      'Failed to load the refreshToken, from "refreshAccessToken" controller',
      null,
      res
    );
    return;
  }

  // compare the refreshTokens
  if (refreshToken !== refreshTokenData.token) {
    errorHandler(
      403,
      'RefreshToken does NOT match, from "refreshAccessToken" controller',
      null,
      res
    );
  }

  // refresh the access token
  const { nickname } = payload;
  const userData = { userId, nickname };
  const accessToken = createToken(userData, "access");
  await res.cookie("accessToken", accessToken, cookieOptions);

  res.status(201).json({
    success: true,
    message: "Successfully refresh the access token",
  });
};

export default refreshAccessToken;
