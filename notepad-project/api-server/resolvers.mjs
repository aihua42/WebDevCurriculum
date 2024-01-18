import db from './models/index.js';
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import cookieOptions from './helpers/cookieOptions.mjs';
import hashPW from "./helpers/hashPW.mjs";
import createToken from './helpers/createToken.mjs';
import isInTextList from "./helpers/isInTextDB.mjs";
import throwError from './throwError.mjs';

import loginJWT from './loginJWT.mjs';
import logoutJWT from './logoutJWT.mjs';

import loginSess from './loginSess.mjs';
import logoutSess from './logoutSess.mjs';

dotenv.config();

const resolvers = {
  Query: {
    // send { userId, textId, title, text }
    text: async (root, { userId, textId }, { res }) => {
      let foundText = {};
      try {
        foundText = await db.Text.findOne({ where: { userId, textId }});
      } catch (err) {
        throwError(500, 'TEXT_LOADING_FAILED', `Failed to load text of textID ${textId}`, res);
      }
      
      return foundText;
    },

    // send { userId, activeTitle, tabs }
    tabs: async (root, { userId }, { res }) => {
      let tabRecordList = [];
      try {
        tabRecordList = await db.Tab.findAll({ where: { userId } });
      } catch (err) {
        throwError(500, 'TAB_LOADING_FAILED', 'Error during loading Tab data in "sendTabs" resolver', res);
        return {};
      }

      const tabObj = {};
      tabObj.userId = userId;

      const textList = tabRecordList.map((obj) => {
        if (obj.active === true) {
          tabObj.activeTitle = obj.title;
        }
        return { title: obj.title, text: obj.text };
      });

      tabObj.tabs = textList;
      return tabObj;
    },
  },

  Mutation: {  
    // sign up
    signup: async (root, { userId, nickname, pw }, { res }) => {
      console.log('User data to sign up: ', { userId, nickname, pw });

      let userFound = null;
      try {
        userFound = await db.User.findOne({ where: { userId } });
      } catch (err) {
        throwError(500, 'USER_LOADING_FAILED', 'Error during loading User DB in "signup"', res);
        return false;
      }

      if (userFound) {  
        throwError(409, 'USER_ALREADY_EXISTS', `${userId} already exists in User DB, from "signup" resolver`, res);
        return false;
      }

      hashPW(pw).then(async (hashedPW) => {
        const userData = { userId, nickname, pw: hashedPW };
    
        try {
          await db.User.create(userData);
          return true;
        } catch (err) {
          throwError(500, 'USER_SIGNUP_FAILED', 'Failed to create the user in "signup"', res);
          return false;
        }
      })
      .catch((err) => {
        throwError(500, 'PASSWORD_HASHING_FAILED', 'Failed to hash the password in "signup"', res);
        return false;
      });
    },
    
    // login
    async login(root, { userId, pw }, { req, res }) {
      //return loginJWT(root, { userId, pw }, { req, res });
      return loginSess(root, { userId, pw }, { req, res });
    },

    // logout
    async logout(root, { userId, activeTitle, tabs }, { req, res }) {
      //return logoutJWT(root, { userId, activeTitle, tabs }, { req, res });
      return logoutSess(root, { userId, activeTitle, tabs }, { req, res });
    },

    // refresh expired access token
    async refreshAccessToken(root, { userId, refreshToken }, { res }) {
      let payload = {};
      try {
        payload = jwt.verify(
          refreshToken,
          process.env.REFRESH_SECRET
        );
        console.log('payload to be used in "refreshAccessToken" resolver: ', payload);
      } catch (err) {
        throwError(403, 'REFRESH_TOKEN_EXPIRED', 'RefreshToken is expired, from "refreshAccessToken" resolver', res);
        return false;
      }

      let refreshTokenData = null;
      try {
        refreshTokenData = await db.Token.findOne({ where: { userId } }); // userId: , token:
      } catch (err) {
        throwError(500, 'REFRESH_TOKEN_LOADING_FAILED', 'Failed to load the refreshToken, from "refreshAccessToken" resolver', res);
        return false;
      }

      if (refreshTokenData === null) {
        throwError(403, 'REFRESH_TOKEN_MISSING', 'RefreshToken is missing in DB, from "refreshAccessToken" resolver', res);
        return false;
      }

      if (refreshToken !== refreshTokenData.token) {
        throwError(403, 'REFRESH_TOKEN_NOT_MATCH', 'RefreshToken does NOT match, from "refreshAccessToken" resolver', res);
        return false;
      }

      const { nickname } = payload;
      const userData = { userId, nickname };
      const accessToken = createToken(userData, "access");
      await res.cookie("accessToken", accessToken, cookieOptions);
      return true;
    },

    // add text
    async addText(root, { userId, textId, title, text }, { res }) {
      console.log('Text data to add: ', { userId, textId, title, text });

      let textList = [];
      try {
        textList = await db.Text.findAll({ where: { userId } });
      } catch (err) {
        throwError(500, 'TEXT_LOADING_FAILED', 'Error during loading Text data in "addText" resolver', res);
        return false;
      }

      if (isInTextList(title, textList)) {
        throwError(409, 'TITLE_ALREADY_EXISTS', `Title "${title}" already exists, from "addText" resolver`, res);
        return false;
      }

      const textToAdd = { userId, textId, title, text };
      try {
        await db.Text.create(textToAdd);
        return true;
      } catch (err) {
        throwError(500, 'TEXT_ADD_FAILED', 'Failed to add text in "addText" resolver');
        return false;
      }
    },

    // update text
    async updateText(root, { userId, textId, key, before, after }, { res }) {
      let textList = [];
      try {
        textList = await db.Text.findAll({ where: { userId } });
      } catch (err) {
        throwError(500, 'TEXT_LOADING_FAILED', 'Error during loading Text data in "updateText" resolver', res);
        return false;
      }

      let newObj = {};
      let where = {};
      if (key === 'title') {
        newObj = { textId, title: after };
        where = { userId, title: before }
      } else {
        newObj = { text: after };
        where = { userId, textId };
      }

      let affectedRows = 0;
      try {
        [affectedRows] = await db.Text.update(newObj, { where });
      } catch (err) {
        throwError(500, 'TEXT_UPDATE_FAILED', `Error during update the ${key} of text id - ${textId}, from "updateText" resolver`, res);
        return false;
      }

      if (affectedRows === 0) {
        throwError(409, 'TEXT_UPDATE_FAILED', `Failed to update the ${key} of text id - ${textId}, from "updateText" resolver`, res);
        return false;
      }

      return true;
    },

    // delete text
    async deleteText(root, { userId, textId }, { res }) {
      let textList = [];
      try {
        textList = await db.Text.findAll({ where: { userId } });
      } catch (err) {
        throwError(500, 'TEXT_LOADING_FAILED', 'Error during loading Text data in "deleteText" resolver');
      }

      if (!isInTextList(textId, textList, "textId")) {
        throwError(404, 'TEXT_NOT_FOUND', `Title of textId "${textId}" does NOT exist, from "deleteText" resolver`, res);
      }

      try {
        await db.Text.destroy({ where: { userId, textId } });
      } catch (err) {
        throwError(500, 'TEXT_DELETE_FAILED', 'Failed to delete text in "deleteText" resolver...');
      }
    }
  }
};

export default resolvers;