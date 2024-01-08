import db from "../models/index.js"; 
import errorHandler from "./errorHandler.mjs";

const deleteToken = async (userId, res) => {
  await db.Token.sync({ alert: true }).then(async () => {
    await db.Token.destroy({ where: { userId } }).catch((err) => {
      return errorHandler(500, 'Fail to delete the refreshToken', err.message, err, res);
    });
  })
};

export default deleteToken;