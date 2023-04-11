<template>
	<!-- 产品意见反馈弹窗层 -->
	<div class="feedBackPopup" style="height: calc(100% - 40px);">
		<!-- 顶部导航 -->
		<van-nav-bar title="产品意见反馈" left-text="我的" fixed placeholder right-text="保存" left-arrow @click-left="navTopBack" @click-right="feedBackConfirm"/>	
		<!-- popup内容区 -->
		<div class="popup-main">
			<div class="msg-box">
				<van-cell-group>
					<van-field v-model="feedBackMessage" autosize  maxlength="200" show-word-limit type="textarea" placeholder="请输入产品反馈意见" size="large"/>
				</van-cell-group>
			</div>
		</div>	
	</div>  
</template>

<script type="text/javascript">
	export default{
		name:"feedBack",
		data:function(){
			return{			
				feedBackMessage:"",//反馈意见	
			};
		},
		methods:{
			//返回键
			navTopBack(){
				this.$router.go(-1)
			},	

			//意见反馈确定
			feedBackConfirm(){
				if(this.feedBackMessage == ""){
					this.$toast("请输入反馈意见");
					return;
				}		
				this.$toast.loading({
					message: '提交中...',
					duration: 0,
					forbidClick: true,
					loadingType: 'spinner',
				});				
				this.$get("saveFeedBack",{sellerId : this.$global.sellerId ,content :this.feedBackMessage}).then(res=>{					
					if(res.status==200){
						this.$toast("保存成功");
						this.feedBackMessage = "";
					}
				}).catch(err=>{
					console.log(err)
				})
			},

		},	
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