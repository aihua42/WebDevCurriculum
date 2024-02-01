// when type = 'title', compare the title
// when type = 'textId' compare the textId
const isInTextList = (value, textList, type = 'title') => {
    if (type !== 'title' && type !== 'textId') {
        throw new Error('Invalid third parameter in isInTextList helper function!');
    }
    return textList.some((ele) => value === ele[type]);
};
export default isInTextList;
