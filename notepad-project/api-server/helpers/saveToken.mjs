import db from "../models/index.js"; 
import errorHandler from "./errorHandler.mjs";

const saveToken = async (userId, token, res) => {
  await db.Token.sync({ alert: true }).then(async () => {
    await db.Token.create({ userId, token })
    .catch((err) => {
      return errorHandler(500, 'Fail to save the refreshToken', err.message, err, res);
    });
  })
};

export default saveToken;