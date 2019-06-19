import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'
import router from './router'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(VueResource)

Vue.use(ElementUI)

Vue.http.options.emulateHTTP = true
Vue.http.options.emulateJSON = true

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
  // render: h => h(App)
})
