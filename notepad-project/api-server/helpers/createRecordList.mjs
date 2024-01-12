// User, Text, Tab
const createRecordList = (data, userId) => {
  const dataList = [];

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

  return dataList;
}

export default createRecordList;