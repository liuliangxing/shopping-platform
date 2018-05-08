import Vue from 'vue'
import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import router from './router'
import store from './store'
import Element from 'element-ui'
// import VueQuillEditor from 'vue-quill-editor'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import echarts from 'echarts'
import App from './App'
// import Rem from '@/utils/rem.js'
// 复制 文本
import VueClipboard from 'vue-clipboard2'
import './permission' // permission control

import * as filters from './filters' // global filters

// 移动端适应配置 START
// Rem()
// window.addEventListener('resize', Rem, false)
// 移动端适应配置 END

Vue.use(Element)
Vue.use(VueClipboard)
Vue.use(echarts)

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
