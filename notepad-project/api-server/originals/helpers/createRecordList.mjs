const createRecordList = (data, userId) => {
    const dataList = data.tabs.map((obj) => {
        const record = {
            userId,
            active: obj.title === data.activeTitle,
            title: obj.title,
            text: obj.text
        };
        return record;
    });
    return dataList;
};
export default createRecordList;
