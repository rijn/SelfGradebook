// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vue from 'vue'
//
// import Hello from './components/Hello'
// import Main from './components/Main'
// const routes = {
//   '/': Hello,
//   '/main': Main
// }

import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
// import routes from './routes'
import App from './App'

Vue.use(VueRouter)
Vue.use(VueResource)

const routes = [
  { path: '/', component: require('./components/Hello') },
  { path: '/main', component: require('./components/Main') }
]

/* eslint-disable no-new */
const router = new VueRouter({
  routes
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router: router
}).$mount('#app')
