<template>
	<!-- 月账单详情-->
	<div class="orderMonthPopup">		
		<!-- 顶部导航 -->
		<van-nav-bar title="月账单" left-text="账单" fixed placeholder right-text="" left-arrow @click-left="navTopBack"  />	
		<!-- popup内容区 -->
		<div class="popup-main" style="height: calc(100% - 40px);overflow:hidden;">
			<!-- 月账单上部时间选择 -->
			<div class="order-month-top">
				<img src="../../assets/image/shop_orderMonthImg.png" alt="">
				<div class="omt-top"><span>{{currentDate}}</span><span class="iconfont icon-jiantou9" @click="yearMonthSelect=true"></span></div>
				<div class="omt-bottom">
					<p>共交易<span>{{orderTotalNum}}</span>笔，合计</p>
					<p>￥20000</p>
				</div>										  				
			</div>
			<!-- 月账单下部账单详情 -->
			<div class="order-month-bottom">
				<div class="omb-table">
					<div class="omb-title">交易分析</div>
				</div>
				<div>
					<div class="omb-title">交易详情</div>
					<ul class="omb-order-list">
						<li><span>4月12日</span><span>+20.00</span></li>
						<li><span>4月12日</span><span>+20.00</span></li>
					</ul>
				</div>
			</div>
		</div>		
		<!-- 年月选择 -->
		<van-popup v-model="yearMonthSelect" position="bottom" :style="{width:'100%', height: '270px'}">
			<van-datetime-picker v-model="currentDatePicker" type="year-month" v-on:cancel="yearMonthSelect=false" v-on:confirm="yearMonthConfirm"  />			
		</van-popup>  
	</div>
	
	
	
</template>

<script>
	export default{
		name:"orderMonthDes",
		data:function(){
			return{
				yearMonthSelect:false,//年月选择				
				currentDate: "",//当前日期
				currentDatePicker: new Date(),//日历当前日期				
				ordersFinish:[],//已完成订单
				ordersFinishNo:0,//已完成订单序号
				ordersSellerGetArr:[],//商家订单所得数组
				orderTotalNum:0,//总交易笔数			
			}
		},
		methods:{
			//返回键
			navTopBack(){
				this.$router.go(-1)
			},
		
			//年月确定
			yearMonthConfirm(e){		
				console.log(e)	
				this.currentDate = this.dealTime(e);
				this.currentDatePicker = this.currentDate;
				this.yearMonthSelect = false;						
			},
						 
			//处理vant日期数据格式 
			dealTime(time){
				let year = time.getFullYear();
				let month = time.getMonth() + 1;		
				return  year + '年' + month + '月';		
			},
			
			//获取月账单
			getFinishOrders(){
				let data = {
					sellerId :this.$global.sellerId,
					pageNum :1,
					pageSize :1000000,
				}
				this.$get("getFinishOrders",data).then(res=>{
					if(res.status ==200){	
						console.log(res)	
						this.orderTotalNum = res.data.total;		
					    res.data.list.forEach(item=>{
							this.ordersFinishNo++;
							item.ordersFinishNo = this.ordersFinishNo;						
							//获取订单详细信息							
							this.$get("getOrderMsg",{orderNo:item.orderNo}).then(resMsg=>{						
								let totalFee = resMsg.data.totalAmount;//小计
								let deliveryFee = resMsg.data.deliveryFee;//配送费
								let serveFeeRate = resMsg.data.serviceFee ;//平台服务费率
								let serveFee = (totalFee - deliveryFee)*(serveFeeRate/100);//平台服务 = （小计-配送费）*服务费率（百分比）								
								let sellerGet = (totalFee - deliveryFee - serveFee) ;//商家所得 = (小计-配送费-平台服务费)
								this.ordersSellerGetArr.push(sellerGet.toFixed(2))
							}).catch(errMsg=>{
								console.log(errMsg)
							})				
							this.ordersFinish.push(item)
						})					
					}
				}).catch(err=>{
					console.log(err)
				})
			},
			
			
			
					
					
		},
		created(){
			let sellerIdData = {sellerId :this.$global.sellerId}
			let yearNow = new Date().getFullYear();
			let monthNow = new Date().getMonth() + 1;				
			this.currentDate =  yearNow + '年' + monthNow + '月';
			console.log('当前时间',this.currentDate)
			this.currentDate = this.$route.params.date
			
			
		},
		mounted() {
			
		}
	}
	
</script>

<style scoped="scoped">
	/deep/ .van-nav-bar{background: #F4BE42;}
	/deep/ .van-nav-bar .van-icon{color: #333333;}
	/deep/ .van-nav-bar .van-nav-bar__text{color: #333333;}
	/deep/ .van-nav-bar__left, .van-nav-bar__right{padding: 0px 7px;}
	
	.order-time-switch{padding:10px 15px;position: fixed;top: 45px;left: 0;right: 0;background: #EEEEEE;}
	.order-time-switch-empty{height: 62px;}
	.ots-top span:first-of-type{font-size: 15px;color:#333333;margin-right: 5px;}
	.ots-top span:last-of-type{color:#B1B1B1;font-size: 14px;}
	.ots-bottom{display: flex;justify-content: space-between;margin-top: 5px;font-size: 13px;color:#8A8A8A}
	.ots-bottom p:last-of-type span:last-of-type{transform: rotateZ(180deg);display: inline-block;margin-left: 2px;}
	.ots-bottom p:last-of-type {border-left: 1px solid 	#C9C9C9;padding-left: 15px;}
	.order-list{background: white;}
	.order-list li{padding: 0 12px;display: flex;align-items: center;}
	.order-list-num {background: #EDC106;width: 30px;line-height:30px;color:white;height:30px;text-align: center;border-radius: 50%;font-size: 18px;font-weight: bold;margin-right: 13px;}
	.olr-no{display: flex;justify-content: space-between;font-size: 15px;color: #333333;}
	.olr-no>div{margin-bottom: 8px;}
	.olr-time{color:#8A8A8A;font-size: 13px;display: flex;justify-content: space-between;}
	.olr-time p:last-of-type{font-weight: bold;font-size: 15px;color: #333333;}
	.order-list-right{border-bottom: 1px solid #E7E7E7;width: 87%;padding: 15px 0;}
	.orderMonthPopup .popup-main{background: white;}
	.order-month-top{background: #F4BE42;color:white;padding: 20px 23px;position: relative;}
	.order-month-top img{position: absolute;right: -25px;top: 12px;display: inline-block;width: 185px;}
	.omt-top{margin-bottom: 28px;}
	.omt-top span:first-of-type{margin-right: 5px;font-size: 15px;}
	.omt-top span:last-of-type{font-size: 14px;}
	.omt-bottom p:first-of-type{font-size: 13px;margin-bottom:10px;}
	.omt-bottom p:last-of-type{font-size: 25px;font-weight: bold;margin-bottom:10px;}
	.order-month-bottom{padding: 0 20px;}
	.omb-title{padding-top: 10px;font-size: 15px;font-weight: bold;}
	.omb-order-list li{padding: 12px 0;display: flex;align-items: center;justify-content: space-between;border-bottom: 1px solid #E7E7E7;font-size: 15px;}
	.omb-order-list li span:last-of-type{font-weight: bold;}
	
</style>
