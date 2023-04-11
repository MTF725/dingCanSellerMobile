<template>
	<!-- 商品审批弹窗 -->
	<div class="goodsApprovePopup" style="height: calc(100% - 46px);">
		<!-- 顶部导航 -->
		<van-nav-bar title="商品审批" left-text="商品管理" fixed placeholder right-text="" left-arrow @click-left="navTopBack" />	
		<!-- popup内容区 -->
		<div class="popup-main" >
			<!-- 进行中组件 -->
			<GoodApprove v-show="goodsAppr"></GoodApprove>
			<!-- 已通过组件 -->
			<GoodPass v-show="goodsPass"></GoodPass>
			<!-- 比驳回组件 -->
			<GoodReject v-show="goodsReject"></GoodReject>

			<!-- 底部空白填充 -->
			<div class="goodsManagePopup-foot-empty"></div>
			<!-- 底部切换 -->
			<div class="goodsManagePopup-foot">
				<div class="foot-item" @click="footSelect('审核中')" :class={apprColor:goodsAppr}>
					<span class="iconfont icon-shenhezhong"></span><span>审核中</span>
				</div>
				<div class="foot-item" @click="footSelect('已通过')" :class={passColor:goodsPass}>
					<span class="iconfont icon-yitongguo"></span><span>已通过</span>
				</div>
				<div class="foot-item" @click="footSelect('已驳回')" :class={rejectColor:goodsReject}>
					<span class="iconfont icon-yibohui"></span><span>已驳回</span>
				</div>					
			</div>    															
		</div>		
	</div> 	   
</template>

<script type="text/javascript">
	import GoodApprove from '../../components/goodsApprove/gApprove.vue';//引入审核中组件
	import GoodPass from '../../components/goodsApprove/gPass.vue';//引入已通过中组件
	import GoodReject from '../../components/goodsApprove/gReject.vue';//引入已驳回组件
	export default{
		name:"goodsApprove",
		components:{GoodApprove,GoodPass,GoodReject},
		data:function(){
			return{			
				goodsAppr:true,//审核中
				goodsPass:false,//已通过
				goodsReject:false,//已驳回			
			};
		},		
		methods:{
			//返回键
			navTopBack(){
				this.$router.push({path:"/goodsManage"})
			},	
			
			//底部导航
			footSelect(e){
				this.goodsAppr = false;
				this.goodsPass = false;
				this.goodsReject = false;
				if(e=="审核中"){
					this.goodsAppr = true;
				}else if(e=="已通过"){
					this.goodsPass = true;
				}else if(e=="已驳回"){
					this.goodsReject = true;
				}
			},			  
		},
		
		//离开路由时
		beforeRouteLeave(to, from, next) {
			if (to.name !== "goodBuild") {
				this.$store.commit("noKeepAlive", "goodsApprove");
			}
			next();
		},	
			 
		created(){							
			// if(!isLogin()){
			// 	this.$router.push({'path':'/login'})
			// }
		
		}
	}
</script>
<style type="text/css" scoped>
	/deep/ .van-nav-bar{background: #F4BE42;}
	/deep/ .van-nav-bar .van-icon{color: #333333;}
	/deep/ .van-nav-bar .van-nav-bar__text{color: #333333;}
	/deep/ .van-nav-bar__left, .van-nav-bar__right{padding: 0px 7px;}
			
	.goodsManagePopup-foot-empty{height: 39px;}
	.goodsManagePopup-foot{display: flex;flex-wrap: wrap;position: fixed;bottom: 0;right: 0;left: 0;font-size: 13px;background: white;}
	.foot-item{flex:1;text-align: center;border-right: 1px solid #E9E9E9;box-sizing: border-box;padding: 10px 0;}
	.foot-item:last-of-type{border-right: 0;}
	.foot-item span:first-of-type{margin-right: 3px;}
	.footColor{color:#F4BE42;}

	.goodsApprovePopup .popup-main{background: white;height: 100%;}
	.goodsApprovePopup .goodsManagePopup-foot .foot-item{width: 33.33%;color:#666666;border-top: 1px solid #E9E9E9;}
	.apprColor{color:#427DF4!important;}
	.passColor{color:#39AD27!important;}
	.rejectColor{color:#F26666!important;}
	
</style>