/* eslint-disable */
import ajax from './ajax'

const api = {}
const requireElement = require.context('@/api', false, /\.js$/)
requireElement.keys().forEach(fileName => {
  api[
    fileName
      .split('/')
      .pop()
      .replace(/\.\w+$/, '')
      .replace(/\-(\w)/g, (all, letter) => letter.toUpperCase())
  ] = requireElement(fileName).default
})

export default api

export { ajax }
