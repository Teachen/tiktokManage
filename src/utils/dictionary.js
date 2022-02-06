const versionTypeMap = {
  1: '初级版',
  2: '分类版',
  3: '平台版',
  6: 'OMO版',
  4: '渠道版',
  5: '五级代理'
}

const workOrderType = {
  0: '总需求工单',
  1: '待分配',
  2: '待处理',
  3: '评估中',
  4: '已解决',
  5: '不予解决',
  6: '处理中'
}

const earlyStage = [
  { label: '分类版', value: 0 },
  { label: '分类版', value: 1 },
  { label: '平台版', value: 2 },
  { label: '平台版', value: 3 },
  { label: '渠道版', value: 4 },
  { label: '初级版', value: 5 },
  { label: 'OMO版本', value: 6 },
  { label: '五级代理', value: 7 }
]

const agentVersion = [
  { label: '初级版', value: 1 },
  { label: '分类版', value: 2 },
  { label: '平台版', value: 3 },
  { label: 'OMO版本', value: 6 },
  { label: '渠道版', value: 4 },
  { label: '五级代理', value: 5 }
]

export {
  versionTypeMap,
  earlyStage,
  agentVersion,
  workOrderType
}
