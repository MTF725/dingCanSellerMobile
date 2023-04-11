<template>
	<div class="index" style="padding-bottom: 45px;position: relative;">	
		<!-- 顶部导航 -->
		<van-nav-bar title="订单管理" left-text="" fixed placeholder >	
		 </van-nav-bar>
		<!-- 订单切换 -->
		<div style="height: 52px;">
			<div class="order-tab">
				<div v-on:click="orderTab(1)" :class="{active:orderTabNum==1}"><i class="iconfont icon-tab icon-xindingdan" style="font-size: 26px;"></i>新订单</div>
				<div v-on:click="orderTab(2)" :class="{active:orderTabNum==2}"><i class="iconfont icon-tab icon-cuidan1" style="font-size: 22px;"></i>催单</div>
			</div>
		</div>
		
		<!-- 进行中组件 -->
		<OrderNew v-show="orderTabNum==1?true:false" ref="orderNew"></OrderNew>	
			
		<!-- 催单组件 -->
		<OrderRemind v-show="orderTabNum==2?true:false" ref="orderRemind"></OrderRemind>		
				
	</div>
</template>

<script type="text/javascript">
	
	let pageNum=1;
	import OrderNew from '../../components/orderPending/orderNew.vue';//新订单组件
	import OrderRemind from '../../components/orderPending/orderRemind.vue';//订单催单组件
	
	export default{
		name:"orderPending",
		components:{OrderNew,OrderRemind},
		data:function(){
			return{
				headImg:'',//头像
				sendPersonName:'',//配送员姓名
				sendPersonPhone:'',//配送员电话
				title:'订单',
				leftSidePopup:false,//左侧设置
				orderTabNum:1,//订单类型切换				
				orderDetailPopup:false,//订单详情
				orderDetail:'',//订单详情
				sendAddress:'',//配送地址
				refreshLoading: false,//下拉刷新								
			};
		},		
		mounted() {
			//滚动到底加载更多
			window.addEventListener('scroll',this.reachBottom)			  
		},
		//销毁监听滚动条事件
		destroyed(){
			window.removeEventListener('scroll', this.reachBottom)
			console.log('销毁')
		},
		computed:{

		},
		
		methods:{								
			// 订单类型切换
			orderTab(e){
				var _this=this;
				pageNum=1;
				_this.newOrderList=[];
				
				_this.orderTabNum=e;
				// 若果切换状态为1，加载进行中订单
				if(_this.orderTabNum==1){
					
				}
				// 若果切换状态为2，加载催单
				if(_this.orderTabNum==2){
					this.$refs.orderRemind.getOrderRemind()
				}	
			},			
		},		
	}
</script>
<style type="text/css" scoped>
	/deep/ .van-nav-bar{background: #F4BE42;}
	/deep/ .van-nav-bar .van-icon{color: #333333;}
	/deep/ .van-nav-bar .van-nav-bar__text{color: #333333;}
	/deep/ .van-nav-bar__left, .van-nav-bar__right{padding: 0px 7px;}	
	
	.big-btn-wrap{margin: 0 15px;}
	.head-wrap img{width: 70px;height: 70px;border-radius: 50%;}
	.head-wrap{text-align: center;border-bottom: 1px solid #eee;padding: 20px 0;}
	.head-wrap p{margin-top: 5px;}

	.head-set{margin-top: 20px;}
	.head-set p{line-height: 2em;padding: 4px 20px;}
	.head-set p .iconfont{color: #F4BE42;margin-right: 10px;}

	.order-tab{position: fixed;width: 100%;line-height: 45px;left: 0;top: 46px;display: flex;box-sizing: border-box;z-index: 2;padding-bottom: 5px;}
	.order-tab div{flex: 1;text-align: center;background-color: #fff;}
	.order-tab div.active{background-color: #FDF2D9;}
	.order-tab div.active .iconfont{color: #F4BE42;}
	.order-tab .iconfont{margin-right: 4px;font-size: 20px;vertical-align: middle;}

	.order-detail p ,.order-detail div{line-height: 25px;}
	.icon-tab{color:#D2D2D2;}
	.icon-lingsheng{font-size: 20px;}
	.icon-lingsheng:active{opacity: 0.8;}
</style>