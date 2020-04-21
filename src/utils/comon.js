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

const roleList = (value, listName) => {
  return axios.get(listName + '?value=' + value)
}
const getSums = listName => {
  return axios.get(listName)
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

const codeData = (
  currentPage,
  limit,
  listName,
  value,
  status,
  codeType,
  materialId
) => {
  return axios.get(
    listName +
      '?pageNow=' +
      currentPage +
      '&pageSize=' +
      limit +
      '&value=' +
      value +
      '&status=' +
      status +
      '&codeType=' +
      codeType +
      '&materialId=' +
      materialId
  )
}

const searchAll = (
  currentPage,
  limit,
  listName,
  a,
  b,
  c,
  d,
  e,
  f,
  g,
  h,
  j,
  k
) => {
  if (typeof a === 'undefined') {
    a = ''
  }
  if (typeof b === 'undefined') {
    b = ''
  }
  if (typeof c === 'undefined') {
    c = ''
  }
  if (typeof d === 'undefined') {
    d = ''
  }
  if (typeof e === 'undefined') {
    e = ''
  }
  if (typeof f === 'undefined') {
    g = ''
  }
  if (typeof h === 'undefined') {
    h = ''
  }
  if (typeof j === 'undefined') {
    j = ''
  }
  if (typeof k === 'undefined') {
    k = ''
  }

  return axios.get(
    listName +
      '?pageNow=' +
      currentPage +
      '&pageSize=' +
      limit +
      a +
      b +
      c +
      d +
      e +
      f +
      g +
      h +
      j +
      k
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

const sendProducts = (ids, orderNo, orderTime, receiver, loadName) => {
  var params = qs.stringify({
    opIds: ids,
    orderNo: orderNo,
    orderTime: orderTime,
    receiver: receiver
  })

  return axios.post(loadName, params)
}
// 更新权限操作
const rightChange = (ids, roleId, loadName) => {
  var params = qs.stringify({ rightIds: ids, roleId: roleId })

  return axios.post(loadName, params)
}
const sendId = (value, listName) => {
  var params = qs.stringify({ productId: value })

  return axios.post(listName, params)
}
// 更新权限操作
const rightInsert = (ids, roleType, loadName) => {
  var params = qs.stringify({ rightIds: ids, roleType: roleType })

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
const productDone = (ids, opType, loadName) => {
  var params = qs.stringify({ opIds: ids, opType: opType })

  return axios.put(loadName, params)
}
export {
  listData,
  searchData,
  dataChange,
  delItem,
  valueData,
  resetPassword,
  rightList,
  codeData,
  rightChange,
  rightInsert,
  getSums,
  roleList,
  productDone,
  searchAll,
  sendId,
  sendProducts
}
