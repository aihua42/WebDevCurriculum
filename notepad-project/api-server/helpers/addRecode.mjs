import errorHandler from "./errorHandler.mjs";
import createRecordList from "./createRecordList.mjs";

import db from "../models/index.js"; 

const addRecode = async (data, userId, modelName, res) => {
  const recodeList = createRecordList(data, userId, modelName);
  console.log('create recode list for ' + modelName, recodeList);
  console.log('received data for '+ modelName, data);
  
  await db[modelName].sync({ alert: true }).then(async () => {
    await db[modelName].bulkCreate(recodeList)
    .then(() => {
      console.log(`Add to ${modelName} DB successfully`);
    }).catch((err) => {
      errorHandler(500, `Fail to add the recode to ${modelName} during add recode`, err, res);
    });
  }).catch((err) => {
    errorHandler(500, `Fail to sync the ${modelName} DB during add recode`, err, res);
  });
};

export default addRecode;
