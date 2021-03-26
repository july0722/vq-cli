import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const modules = {}
;[require.context('../store/modules', false, /\.js$/), require.context('@/store', false, /\.js$/)].forEach(ctx => {
  ctx
    .keys()
    .map(ctx)
    .forEach(item => {
      if (!item.default.name) {
        console.error('store: should set a name.')
      } else {
        modules[item.default.name] = item.default
      }
    })
})

export default new Vuex.Store({
  state: {
    env: Object.freeze(process.env),
  },
  mutations: {},
  actions: {},
  modules,
})
