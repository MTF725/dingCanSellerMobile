<template>
	<!-- 配送弹窗 -->
	<div class="sendSetPopup">		
		<!-- 顶部导航 -->
		<van-nav-bar title="配送" left-text="门店运营" fixed placeholder right-text="" left-arrow @click-left="navTopBack" />	
		<!-- popup内容区 -->
		<div class="popup-main" style="height: calc(100% - 40px);overflow:hidden;">
			<van-cell title="出餐时间" is-link v-model="oldMealTime"	@click="mealTimeShow = true" />
			<van-cell title="取餐地址" center v-model="winAddress" />
			<van-cell title="取餐方式"  >
				<template #right-icon>
					<div class="model-select-box">
						<van-checkbox  v-model="sendModelZiTi" icon-size="17px" checked-color="#F4BE42" @click="sendModelSelect('到店自提')">到店自提</van-checkbox>
						<van-checkbox  v-model="sendModelWaiMai" icon-size="17px" checked-color="#F4BE42" @click="sendModelSelect('外卖配送')">外卖配送</van-checkbox>			
						<van-checkbox  v-model="sendModelDaoDian" icon-size="17px" checked-color="#F4BE42" @click="sendModelSelect('到店用餐')">到店用餐</van-checkbox>		
					</div>		
				</template>
			</van-cell>	

			<!-- 修改出餐时间弹层 -->
			<div class="MealTimePopup edit-window" :class="{showthis:mealTimeShow}">		     
				<div class="edit-box">
					<input type="text" v-model="mealTime" placeholder="请输入承诺出餐时间">
					<span class="min-text">(分钟)</span>
	  <van-checkbox  v-model="mealTimeAuto" icon-size="17px" checked-color="#F4BE42" @click="mealTimeAuto = !mealTimeAuto">达到出餐时间系统自动更新订单状态为已出餐</van-checkbox>
					<div class="btns">
						<van-button @click="mealTimeConfirm" type="primary">确定</van-button>
						<van-button @click="mealTimeShow=false;" type="primary">取消</van-button>
					</div>	 
				</div>   		  
			</div>		
		</div>		
	</div>
</template>

<script>	
	export default {
		name:"sendSet",
		data:function(){
			return{
				mealTimeShow:false,//出餐时间弹窗
				sendModelDaoDian:false,//到店用餐
				sendModelWaiMai:true,//外卖配送
				sendModelZiTi:false,//到店自提
				oldMealTime:"",//配送修改页展示出餐时间
				mealTime:"",//出餐时间
				mealTimeAuto:false,//自动出餐
				winAddress:"",//窗口地址
			}
		},
		methods:{
			//返回键
			navTopBack(){
				this.$router.go(-1)
			},		
			
			//配送方式选择
			sendModelSelect(e){
				if(e=="到店用餐"){
					this.sendModelDaoDian = !this.sendModelDaoDian
				}else if(e=="外卖配送"){
					this.sendModelWaiMai = !this.sendModelWaiMai
				}else {
					this.sendModelZiTi = !this.sendModelZiTi
				}			
				let modeIdArr = [];
				if(this.sendModelZiTi==true && this.sendModelWaiMai==true && this.sendModelDaoDian==true){
					modeIdArr=[1,2,3]
				}else if(this.sendModelZiTi==true && this.sendModelWaiMai==true && this.sendModelDaoDian==false){
					modeIdArr=[1,2]
				}else if(this.sendModelZiTi==true && this.sendModelWaiMai==false && this.sendModelDaoDian==true){
						modeIdArr=[1,3]
				}else if(this.sendModelZiTi==false && this.sendModelWaiMai==true && this.sendModelDaoDian==true){
						modeIdArr=[2,3]
				}else if(this.sendModelZiTi==true && this.sendModelWaiMai==false && this.sendModelDaoDian==false){
						modeIdArr=[1]
				}else if(this.sendModelZiTi==false && this.sendModelWaiMai==true && this.sendModelDaoDian==false){
						modeIdArr=[2]
				}else if(this.sendModelZiTi==false && this.sendModelWaiMai==false && this.sendModelDaoDian==true){
						modeIdArr=[3]
				}else if(this.sendModelZiTi==false && this.sendModelWaiMai==false && this.sendModelDaoDian==false){
						modeIdArr=[]
				}
				
				let data = {
					sellerId:this.$global.sellerId,
					modeIdGroup :modeIdArr.toString()
				}			
				this.$post("sendModelSet",data).then(res=>{									
				}).catch(err=>{
				
				})
			},
			
			//设置出餐时间
			mealTimeConfirm(){
				if(this.mealTime.trim()==""){
					this.$toast("请设置出餐时间");
					return;
				}			  
				if (!(posReg.test(this.mealTime.trim()))) {
					this.$toast('出餐时间必须是大于或等于0的数字');
					return false;
				}
				let data = {
					sellerId :this.$global.sellerId ,
					stateId :this.mealTimeAuto?1:0,
					time :this.mealTime
				}
				this.$toast.loading({
					message: '提交中...',
					duration: 0,
					forbidClick: true,
					loadingType: 'spinner',
				});			
				this.$post("mealTimeSet",data).then(res=>{					
					if(res.status==200){
						this.$toast("设置成功");
						this.oldMealTime = this.mealTime+"分钟" ;
						this.mealTimeShow = false;
					}
					this.$toast.clear()
				}).catch(err=>{
					
				})
			},
				
			//获取配送设置信息
			getDeliveryMsg(){
				this.$get("getDeliveryMsg",{sellerId :this.$global.sellerId}).then(res=>{				
					if(res.status==200){
						this.winAddress = res.data.winAddress;
						this.mealTime = res.data.mealTime;
						this.oldMealTime =  res.data.mealTime+"分钟";
						this.mealTimeAuto = res.data.autoModOrderState==0?false:true;
						this.sendModelDaoDian=false;//到店用餐
						this.sendModelWaiMai=false;//外卖配送
						this.sendModelZiTi=false;//到店自提
						if(res.data.deliveryMode.indexOf(1)!=-1){
							this.sendModelZiTi=true;
						}
						if(res.data.deliveryMode.indexOf(2)!=-1){
							this.sendModelWaiMai=true;
						}
		
						if(res.data.deliveryMode.indexOf(3)!=-1){
							this.sendModelDaoDian=true;
						}		
					}			
				}).catch(err=>{
					
				})
				
			},
		},
		created(){
			let sellerIdData = {sellerId :this.$global.sellerId}
			let yearNow = new Date().getFullYear();
			let monthNow = new Date().getMonth() + 1;				
			this.currentDate =  yearNow + '年' + monthNow + '月';
			//获取配送设置
			this.sendSetShow=true;
			this.getDeliveryMsg();
		}
	}
	
</script>

<style scoped>
	/deep/ .van-nav-bar{background: #F4BE42;}
	/deep/ .van-nav-bar .van-icon{color: #333333;}
	/deep/ .van-nav-bar .van-nav-bar__text{color: #333333;}
	/deep/ .van-nav-bar__left, .van-nav-bar__right{padding: 0px 7px;}
	
	.sendSetPopup{height: 100%;}
	.sendSetPopup .van-cell span, .sendSetPopup .van-cell .van-cell__value{color:#333333}
	.model-select-box .van-checkbox:not(:last-of-type){margin-bottom: 5px;}
	.edit-window{position: absolute;left: 0;top: 0;right: 0;bottom: 0;width: 100%;height: 100%;display: flex;justify-content: center;display: none;}
	.edit-box{width:270px;height:120px;text-align: left;padding:30px 15px;background: white;margin-top: 130px;z-index: 3; box-shadow:0 3px 5px rgba(0,0,0,0.16);position: relative;}
	.edit-box input{width:90%;height: 30px;padding-left: 5px;border: 1px solid #E6E6E6;margin-left: 10px;}
	.edit-box .btns{margin-top:15px;text-align: center;}
	.edit-box .min-text{position: absolute;right: 31px;top: 36px;color: #999999;}
	.btns button{width:65px;height:30px;line-height: 30px;color:#333333;}
	.btns button:first-of-type{margin-right: 10px;background-color: #F4BE42;border: 1px solid #F4BE42;}
	.btns button:last-of-type{background-color: #fff;border: 1px solid #D2D2D2;}
	.showthis{display: flex!important;}
	.MealTimePopup .van-checkbox{margin-top: 10px;width: 95%;margin-left: 10px;}
</style>
