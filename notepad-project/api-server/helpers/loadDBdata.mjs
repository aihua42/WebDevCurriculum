import db from "../models/index.js";  

const loadDBdata = async (userId, modelName) => {
  let record = await db[modelName].findAll({ where: { userId } });
  console.log('Model to load: ', db[modelName]);
  console.log('Loaded records in "loadDBData" function: ', record);

  let data = modelName === 'Text' ? [] : {};

  if (record.length === 0) { 
    return data;
  } 

  try {
    if (modelName === 'User') {  
      const { userId, nickname, pw } = record[0];  // const data = JSON.parse(JSON.stringify(record[0])); // not feasible because the structure is complex
      data = { userId, nickname, pw };
    } else if (modelName === 'Text') {
      record.forEach((obj) => {
        const { textId, title, text } = obj;
        const newObj = { textId, title, text };
        data.push(newObj);
      });
    } else if (modelName === 'Tab') {
      data.userId = userId;
      const tabs = [];
      
      record.forEach((obj) => {
        tabs.push({ title: obj.title, text: obj.text });
        if (obj.active === true) {
          data.activeTitle = obj.title;
        }
      });

      if (tabs.length > 0) {
        data.tabs = tabs;
      }
    } else if (modelName === 'Token') {
      data.token = record[0].token;
    } else {
      throw new Error(`Invalid DB type in "loadDBdata" function - ${modelName}`);
    }
  } catch (err) {
    throw new Error(`Something is going wrong when loading ${modelName} data in "loadDBdate" function`);
  }

  return data;
};

export default loadDBdata;