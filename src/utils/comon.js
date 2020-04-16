/* eslint-disable camelcase */
import qs from 'qs'
import axios from 'axios'

// 获取table数据
const listData = (currentPage, limit, listName) => {
  return axios.get(listName + '?pageNow=' + currentPage + '&pageSize=' + limit)
}

const rightList = (value, listName) => {
  return axios.get(listName + '?roleId=' + value)
}

// 条件查询
const valueData = (
  currentPage,
  limit,
  listName,
  value,
  province,
  city,
  roleType
) => {
  return axios.get(
    listName +
      '?pageNow=' +
      currentPage +
      '&pageSize=' +
      limit +
      '&value=' +
      value +
      '&province=' +
      province +
      '&city=' +
      city +
      '&roleType=' +
      roleType
  )
}
// 提前获取生产厂家条件筛选数据
const searchData = loadName => {
  return axios.get(loadName)
}
// 更新或新增操作
const dataChange = (arr, loadName) => {
  var params = qs.stringify(arr)

  return axios.post(loadName, params)
}
// 删除操作
const delItem = (id, loadName) => {
  return axios.delete(loadName, {
    params: {
      ids: id
    }
  })
}
const resetPassword = (id, loadName) => {
  var params = qs.stringify({ id: id })

  return axios.post(loadName, params)
}
export {
  listData,
  searchData,
  dataChange,
  delItem,
  valueData,
  resetPassword,
  rightList
}
