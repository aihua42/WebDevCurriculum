import createRecordList from "./createRecordList.mjs";

import db from "../models/index.js"; 

const addRecord = async (data, userId, modelName) => {
  const recodeList = createRecordList(data, userId, modelName);

  try {
    await db[modelName].bulkCreate(recodeList);
    console.log(`Add to ${modelName} DB successfully`);
  } catch (err) {
    throw new Error('Fail in "addRecord" function');
  }
};

export default addRecord;
