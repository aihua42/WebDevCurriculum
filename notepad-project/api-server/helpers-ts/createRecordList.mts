import { type TabRecord, type Tabs } from '../types'

const createRecordList = (data: Tabs, userId: string): TabRecord[] => {
  const dataList = data.tabs.map((obj) => {
    const record: TabRecord = {
      userId,
      active: obj.title === data.activeTitle,
      title: obj.title,
      text: obj.text
    }

    return record
  })

  return dataList
}

export default createRecordList
