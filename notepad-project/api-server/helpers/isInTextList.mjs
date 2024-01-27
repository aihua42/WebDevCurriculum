// when type = 'title', compare the title
// when type = 'textId' compare the textId
const isInTextList = (value, textList, type = "title") => {
  return textList.some((ele) => value === ele[type]);
};

export default isInTextList;
