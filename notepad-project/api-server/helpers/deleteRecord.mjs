import db from "../models/index.js";

const deleteRecord = async (userId, modelName, textId = null) => {
  try {
    const recordToDelete = textId === null ? { userId } : { userId, textId };
    await db[modelName].destroy({ where: recordToDelete });

    console.log(`Deleted ${deletedRowsCount} record(s) of ${userId}'s ${modelName} DB`);
  } catch (err) {
    throw new Error('Fail in "deleteRecord" function');
  }
};

export default deleteRecord;
