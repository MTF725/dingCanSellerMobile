import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store/index.js';
import Vant from 'vant';
import axios from 'axios';
import 'vant/lib/index.css';

//http
import {get ,post , put,del,fromDataPost,postArr,delArr} from './views/http/http'
Vue.prototype.$get = get;
Vue.prototype.$post = post;
Vue.prototype.$put = put;
Vue.prototype.$del = del;
Vue.prototype.$fromDataPost = fromDataPost;
Vue.prototype.$postArr = postArr;
Vue.prototype.$delArr = delArr;

//mycommon
import Global from '../public/js/myCommon.js';
import {getSystemDate,getSecond} from '../public/js/myCommon.js';
Vue.prototype.$global = Global ;
Vue.prototype.$getSystemDate = getSystemDate;
Vue.prototype.$getSecond = getSecond;

// 全局引入顶部导航组件
import topFixedNav from './components/topFixedNav.vue';
Vue.component('top-fixed-nav',topFixedNav);

//axios
Vue.prototype.$axios = axios; 
Vue.use(Vant);

//全局注册组件
import myBScroll from './components/betterScroll/betterScroll.vue';
Vue.component('myBScroll', myBScroll)

Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
