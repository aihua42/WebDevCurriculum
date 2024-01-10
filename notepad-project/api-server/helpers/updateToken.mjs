import db from "../models/index.js"; 

const updateToken = async (userId, token) => {
  const newToken = { token };

  try {
    await db.Token.update({ newToken }, { where: { userId } });
  } catch (err) {
    throw new Error('Fail in "updateToken" function');
  }
};

export default updateToken;