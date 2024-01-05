const hasTitle = (title, textList) => {
  return textList.some((ele) => title === ele.title);
}

export default hasTitle;