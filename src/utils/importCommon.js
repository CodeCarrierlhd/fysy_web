import axios from 'axios'
const exportCompanyExcel = (obj, url) => {
  return axios({
    method: 'POST',
    url: url,
    params: obj,
    responseType: 'blob',
    headers: {}
  })
}

const downloadFile = (data, name) => {
  const timestamp = new Date().getTime()
  // 文件导出
  if (!data) {
    return
  }
  const url = window.URL.createObjectURL(new Blob([data]))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', name + timestamp + '.xls')
  document.body.appendChild(link)
  link.click()
}
export { exportCompanyExcel, downloadFile }
