import db from "../models/index.js"; 

const saveToken = async (userId, token) => {
  try {
    await db.Token.create({ userId, token });
  } catch (err) {
    console.error(err);
    throw new Error('Fail to save the refreshToken, from "saveToken" function');
  }
};

export default saveToken;