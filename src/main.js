import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import store from './store'

Vue.config.productionTip = false
const cwd = process.env.VUE_APP_PROCESS_CWD
require(`${cwd}/src/router`).default(router)

new Vue({
  router,
  //   store,
  render: (h) => h(App),
}).$mount('#app')
