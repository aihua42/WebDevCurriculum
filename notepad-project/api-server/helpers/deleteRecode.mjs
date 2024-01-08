import errorHandler from "./errorHandler.mjs";

import db from "../models/index.js";  

const deleteRecode = async (userId, modelName, res, textId = null) => {
  await db[modelName].sync({ alert: true }).then(async () => {
    const recodeToDelete = textId === null ? { userId } : { userId, textId };

    await db[modelName].destroy({ where: recodeToDelete }).then((deletedRowsCount) => {
      if (deletedRowsCount > 0) {
        console.log(`Deleted ${deletedRowsCount} recode(s) for ${userId}'s in ${modelName} DB`);
      } else {
        console.log(`Nothing to delete for ${userId}'s in ${modelName} DB`);
      }
    }).catch((err) => {
      errorHandler(500, `Fail to delete for ${userId}'s in ${modelName} DB`, err.message, err, res);
    })
  }).catch((err) => {
    errorHandler(500, `Fail to sync when deleting for ${userId}'s in ${modelName} DB`, err.message, err, res);
  });
}

export default deleteRecode;