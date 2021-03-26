import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './layouts'

Vue.config.productionTip = false
require('@/router').default(router)
require('@/main').default()
Object.defineProperty(Vue.prototype, '$api', { value: require('./api').default })

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
