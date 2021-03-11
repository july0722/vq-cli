import Vue from 'vue'

const name = name =>
  name
    .split('/')
    .pop()
    .replace(/\.\w+$/, '')

const defaultLayoutCtx = require.context('../layouts', false, /\.vue$/)
defaultLayoutCtx.keys().forEach(layout => Vue.component(name(layout), defaultLayoutCtx(layout).default))

const systemLayoutCtx = require.context('@/layouts', false, /\.vue$/)
systemLayoutCtx.keys().forEach(layout => Vue.component(name(layout), systemLayoutCtx(layout).default))
