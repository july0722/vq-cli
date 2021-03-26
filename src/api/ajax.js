import axios, { CancelToken } from 'axios'
import Vue from 'vue'
import { MessageBox, Loading } from 'element-ui'

let loadingCount = 0
let $loading
const requests = {}
const requestKey = (url, data, method) => `${url}${JSON.stringify(data)}${method}`
const instance = axios.create({ baseURL: '/api', withCredentials: true })
const hideLoading = () => {
  Vue.nextTick(() => {
    if (loadingCount <= 0) return
    loadingCount--
    loadingCount === 0 && $loading && $loading.close()
  })
}

const errorHandle = ({ status, data } = {}) => {
  if (!status) {
    MessageBox.alert('服务器发生异常，请联系管理员!', '系统处理错误', { type: 'error' })
  } else {
    MessageBox.alert(data?.message, '系统处理错误', { type: 'error' })
  }
}

instance.interceptors.request.use(
  config => {
    return config
  },
  error => Promise.reject(error)
)

instance.interceptors.response.use(
  response => {
    hideLoading()
    response.data.code !== 200 && errorHandle(response.data)
    return response.data
  },
  error => {
    hideLoading()
    error.__CANCEL__ || errorHandle(error.response)
    return Promise.reject(error)
  }
)

/**
 * @param {*} url    地址
 * @param {*} data   数据
 * @param {*} method 方式
 * @param {*} type   提交数据格式 FORM/JSON
 * @param {*} config 默认支持axios请求相关配置（如timeout等），另额外配置loading等于false时会隐藏遮罩
 */
export const ajax = (url, data = {}, method = 'GET', type = 'FORM', config = {}) => {
  if (method === 'GET' && type.constructor === Object) {
    config = type
  }
  if (loadingCount === 0 && config.loading !== false) {
    $loading = Loading.service({ lock: true, background: 'rgba(0, 0, 0, 0.3)' })
  }
  delete config.loading
  loadingCount++
  const key = requestKey(url, data, method)
  if (requests[key]) {
    requests[key](`cancel ${key}`)
    delete requests[key]
  }
  config.cancelToken = new CancelToken(c => (requests[key] = c))
  if (method === 'GET') {
    return instance.get(url, { params: { data }, ...config })
  } else {
    if (type === 'FORM') {
      const formData = new FormData()
      Object.keys(data).forEach(key => formData.append(key, data[key]))
      config.headers || (config.headers = { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' })
      return instance.post(url, formData, config)
    } else {
      config.headers || (config.headers = { 'Content-Type': 'application/json;charset=UTF-8' })
      return instance.post(url, data, config)
    }
  }
}

/**
 * axios实例
 */
export default instance
