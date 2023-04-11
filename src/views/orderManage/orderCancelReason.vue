<template>
	<!-- 取消原因弹窗层 -->
	<div class="feedBackPopup" style="height: calc(100% - 40px);">
		<!-- 顶部导航 -->
		<van-nav-bar title="取消原因" left-text="进行中" fixed placeholder right-text="确定" left-arrow @click-left="navTopBack" @click-right="orderCancel" />	
		<!-- popup内容区 -->
		<div class="popup-main">
			<div class="msg-box">
				<van-cell-group>
					<van-field v-model="reason" autosize  maxlength="200" show-word-limit type="textarea" placeholder="请输入取消原因" size="large"/>
				</van-cell-group>
			</div>
		</div>	
	</div>  
</template>


<script type="text/javascript">

	export default{
		name:"orderCancelReason",
		data:function(){
			return{
				reason:"",//取消原因
				orderNo:"",//订单编号
			};
		},
		mounted() {			
			 document.querySelector('html').setAttribute('style', 'background-color:#white')
		},
		
		computed:{},
		
		methods:{
			//返回键
			navTopBack(){
				this.$router.go(-1)
			},
			
			//取消订单确定
			orderCancel(){
				if(this.reason == ""){
					this.$toast("请输入取消原因");
					return;
				}		
				this.$toast.loading({
					message: '提交中...',
					duration: 0,
					forbidClick: true,
					loadingType: 'spinner',
				});	
				this.$post("cancelOrder",{orderNo :this.orderNo}).then(res=>{
					if(res.status==200){
						this.$toast("单号"+e+"取消成功");
						this.$router.push({path:"/orderManage"})
					}else{
						this.$toast(res.msg)
					}
					this.$toast.clear()
				}).catch(err=>{
					console.log(err)
				})		
			},

		},
		created(){				
			 let sellerIdData = {sellerId :this.$global.sellerId}
			 this.orderNo= this.$route.query.orderNo;					
		}
	}
</script>
<style type="text/css" scoped>
	/deep/ .van-nav-bar{background: #F4BE42;}
	/deep/ .van-nav-bar .van-icon{color: #333333;}
	/deep/ .van-nav-bar .van-nav-bar__text{color: #333333;}
	/deep/ .van-nav-bar__left, .van-nav-bar__right{padding: 0px 7px;}

	.feedBackPopup .popup-main{background: white;height: 100%;}
	.msg-box{display: flex;justify-content: center;margin-top:15px ;}
	.msg-box .van-cell-group{width: 90%;border:1px solid #DDDDDD}
	.windowSetPopup{position: relative;}
	.windowSetPopup .vant-cell-item{border-bottom:1px solid #ebedf0;position: relative;} 
	.windowSetPopup .vant-cell-pic .van-cell--center{height: 80px;}
	.windowSetPopup .vant-cell-item img{width:53px;height: 53px;display: inline-block;position: absolute;left: 286px;top: 12px;}
  .window-img{width:53px;height: 53px;display: inline-block;position: absolute;left: 286px;top: 12px;}
	.van-cell-part{margin-bottom: 5px;}
	
</style>