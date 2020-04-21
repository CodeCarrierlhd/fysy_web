import axios from 'axios'

// 下载模板

export const downloadTemplate = function(scheduleType) {
  axios
    .get('/rest/schedule/template', {
      params: {
        scheduleType: scheduleType
      },
      responseType: 'arraybuffer'
    })
    .then(response => {
      // 创建一个blob对象,file的一种
      const blob = new Blob([response.data], { type: 'application/x-xls' })
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download =
        // eslint-disable-next-line no-undef
        fileNames[scheduleType] + '_' + response.headers.datestr + '.xls'
      link.click()
    })
}
