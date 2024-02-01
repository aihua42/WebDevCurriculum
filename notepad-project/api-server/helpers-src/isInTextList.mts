import { type TextRecord } from '../types.ts'

// when type = 'title', compare the title
// when type = 'textId' compare the textId
const isInTextList = (
  value: string,
  textList: TextRecord[],
  type = 'title'
): boolean => {
  if (type !== 'title' && type !== 'textId') {
    throw new Error('Invalid third parameter in isInTextList helper function!')
  }

  return textList.some((ele: TextRecord) => value === ele[type])
}

export default isInTextList
