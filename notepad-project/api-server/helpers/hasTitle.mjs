// when type = 'title', compare the title
// when type = 'textId' compare the textId
const hasTitle = (title, textList, type = 'title') => {
  return textList.some((ele) => title === ele[type]);
}

export default hasTitle;