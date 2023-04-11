import Vue from 'vue'
import VueRouter from 'vue-router'
// import store from 'store/index.js';
import store from '../store/index.js'
Vue.use(VueRouter);

  const routes = [
  {path:'/',name:'default',redirect:'/mine',component:()=>import('../views/mine/mine.vue')},//默认加载路由
  {path: '/login',name: 'login',component:()=>import('../views/logIn.vue')},//登录
  // 个人中心
  {path: '/mine',name: 'mine',component:()=>import('../views/mine/mine.vue'),meta:{index:1}},//我的
  {path: '/windowSet',name: 'windowSet',component:()=>import('../views/mine/windowSet.vue'),meta:{index:2}},//窗口设置
  {path: '/windowSetPics',name: 'windowSetPics',component:()=>import('../views/mine/windowSetPics.vue')},//窗口图片
  {path: '/orderSet',name: 'orderSet',component:()=>import('../views/mine/orderSet.vue')},//订单设置
  {path: '/printSet',name: 'printSet',component:()=>import('../views/mine/printSet.vue')},//打印设置
  {path: '/feedBack',name: 'feedBack',component:()=>import('../views/mine/feedBack.vue')},//产品意见反馈
  //门店运营
  {path: '/shopOperation',name: 'shopOperation',component:()=>import('../views/shopOperation/shopOperation.vue')},//门店运营首页
  {path: '/goodsManage',name: 'goodsManage',component:()=>import('../views/shopOperation/goodsManage.vue')},//商品管理
  {path: '/manageType',name: 'manageType',component:()=>import('../views/shopOperation/manageType.vue')},//管理分类
  {path: '/manageTypeEdit',name: 'manageTypeEdit',component:()=>import('../views/shopOperation/manageTypeEdit.vue')},//添加/编辑分类
  {path: '/goodsApprove',name: 'goodsApprove',component:()=>import('../views/shopOperation/goodsApprove.vue')},//商品审批
  {path: '/goodBuild',name: 'goodBuild',component:()=>import('../views/shopOperation/goodBuild.vue'),meta:{keepAlive:true}},//新建商品/商品编辑
  {path: '/comments',name: 'comments',component:()=>import('../views/shopOperation/comments.vue')},//用户评价
  {path: '/order',name: 'order',component:()=>import('../views/shopOperation/order.vue')},//账单
  {path: '/orderMonthDes',name: 'orderMonthDes',component:()=>import('../views/shopOperation/orderMonthDes.vue')},//月账单详情
  {path: '/sendSet',name: 'sendSet',component:()=>import('../views/shopOperation/sendSet.vue')},//配送
  {path: '/noticeMsg',name: 'noticeMsg',component:()=>import('../views/shopOperation/noticeMsg.vue')},//公告信息 
  //订单管理
  {path: '/orderManage',name: 'orderManage',component:()=>import('../views/orderManage/orderManage.vue')},//订单管理 
  {path: '/orderCancelReason',name: 'orderCancelReason',component:()=>import('../views/orderManage/orderCancelReason.vue')},//订单取消原因
  //待处理
  {path: '/orderPending',name: 'orderPending',component:()=>import('../views/orderPending/orderPending.vue')},//待处理 
];

const router = new VueRouter({
  routes
});
// 全局导航守卫
router.beforeEach((to, from, next) => {    
    if (to.name === 'goodBuild') {
        store.commit('isKeepAlive', to.name);   
    }
	next();
})


export default router;
