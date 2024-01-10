import db from "../models/index.js"; 
import errorHandler from "./errorHandler.mjs";

const deleteToken = async (userId) => {
  try {
    await db.Token.destroy({ where: { userId } });
  } catch (err) {
    throw new Error('Fail in "deleteToken" function');
  }
};

export default deleteToken;