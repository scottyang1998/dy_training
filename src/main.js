import Vue from 'vue'
import App from './App.vue'
import router from './router'
import element from './plugins/element'

Vue.use(element)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
