import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import store from './store'
import './layouts'

Vue.config.productionTip = false
require(`@/router`).default(router)

new Vue({
  router,
  //   store,
  render: (h) => h(App),
}).$mount('#app')
