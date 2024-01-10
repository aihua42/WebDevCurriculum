// User, Text, Tab
const createRecordList = (data, userId, modelName) => {
  const dataList = [];
  
  if (modelName === 'Tab') {
    data.tabs.forEach((obj) => {
      const record = {};
      record.userId = userId;
      
      if (obj.title === data.activeTitle) {
        record.active = true;
      } else {
        record.active = false;
      }

      record.title = obj.title;
      record.text = obj.text;

      dataList.push(record);
    });
  } else {
    const newData = JSON.parse(JSON.stringify(data));  

    if (modelName === 'Text') {
      newData.userId = userId;
    }

    dataList.push(newData);
  }

  return dataList;
}

export default createRecordList;