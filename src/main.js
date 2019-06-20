import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui'

import App from './App.vue'
import router from './router'

import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false;
 
Vue.use(VueAxios, axios);

Vue.use(ElementUI);

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
  // render: h => h(App)
});
