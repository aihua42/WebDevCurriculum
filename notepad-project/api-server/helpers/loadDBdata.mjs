import db from "../models/index.js";  

const loadDBdata = async (userId, modelName, res) => {
  const data = modelName === 'Text' ? [] : {};

  try {
    let record = [];
    try {
      record = await db[modelName].findAll({ where: { userId } });
    } catch (err)  {
      console.log(`User ${userId} does NOT have any saved Data in ${modelName} DB`);
      return data;
    }
    
    if (record.length > 0) {
      data.userId = userId;
    }

    if (modelName === 'User') {
      data.nickname = record[0].nickname;
      data.pw = record[0].pw;
    } else if (modelName === 'Text') {
      record.forEach((obj) => {
        const { textId, title, text } = obj;
        data.push({ textId, title, text });
      });
    } else if (modelName === 'Tab') {
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
    } else {
      data.token = record[0].token;
    }

    console.log(`Load ${userId}'s ${modelName} DB successfully: `, data);
    return data;
  } catch (err) {
    console.log(`No ${modelName} data to load from DB`);
    return data;
  }
};

export default loadDBdata;