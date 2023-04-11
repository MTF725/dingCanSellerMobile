<template>
	<div class="index" style="padding-bottom: 45px;position: relative;">		
		<!-- 下拉刷新 -->
		<van-pull-refresh v-model="refreshLoading" @refresh="onRefresh">
			<!-- 订单列表 -->
			<div class="order-detail" v-for="(item,index) in allMsgData" :key="index">
				<div class="detail-title">{{index+1}}.{{judgeState(item.msg1.orderState)}}</div>
				<!-- 配送信息 -->
				<div class="detail-sendmsg">				
					<p class="font-title">{{item.msg2.contact}}</p>
					<p><span class="msg-text">电话：</span><span class="phone">{{item.msg2.phone}}</span></p>
					<div class="clearfix">
						<p class="msg-text">收货地址：</p>
						<p class="msg-address">{{item.msg2.address}}</p>
					</div>
					<div class="clearfix">
						<p class="msg-text">订单号：</p>
						<p class="msg-orderNo">{{item.msg2.orderNo}}</p>
					</div>
					<p><span class="msg-text">订单提交日期：</span><span>{{item.msg1.createTime}}</span></p>
				</div>
				<!-- 进度 -->
				<div class="detail-process">
					<div class="process-title" @click="openDetile('process',index)">
						<span class="font-title">进度</span><span>{{item.processBox?"收起":"展开"}}<i class="iconfont icon-jiantou9"></i></span>
					</div>			
					<ul class="process-content"  v-show="item.processBox">
						<li v-for="(item2,index2) in item.msg3" :key="index2">
							<span>{{item2.stateName}}</span><span class="times">{{item2.createTime}}</span>
						</li>					
					</ul>	
				</div>				
				<!-- 商品详情 -->
				<div class="goods-des">
					<div class="goods-title"  @click="openDetile('goods',index)">
						<span class="font-title">商品</span><span>{{item.goodsBox?"收起":"展开"}}<i class="iconfont icon-jiantou9"></i></span>
					</div>
					<!-- 商品列表 -->
					<div class="goods-list" v-show="item.goodsBox">
						<ul>
							<li class="goods-list-item" v-for="(item3,index3) in item.msg1.goods" :key="index3">
								<p>{{item3.goodsName}}</p>
								<p><span class="goods-item-number">*{{item3.buyCount}}</span><span>￥{{item3.gPrice}}</span></p>
							</li>
						</ul>
						<p><span>环保费</span><span>￥{{item.greenFeeAll}}</span></p>
						<p><span>配送费</span><span>￥{{item.msg4.deliveryFee}}</span></p>
						<p><span class="font-title">小计</span><span class="font-title">￥{{item.msg4.totalAmount}}</span></p>
						<p><span>实际支付金额</span><span>￥{{item.msg4.totalAmount}}</span></p>
						<p><span>平台服务费</span><span>￥{{item.msg4.serveFeeMoney}}</span></p>
						<p><span class="font-title">本单预计收入</span><span class="font-title">￥{{item.msg4.sellerGet}}</span></p>
						<p><span>订餐方式</span><span>{{judgeMealMode(item.msg1.mealMode)}}</span></p>
						<p><span>期望送达时间</span><span>{{item.msg1.arrivalTime}}</span></p>
						<div class="clearfix">
							<p class="msg-text">备注</p>
							<p class="msg-remark">{{item.msg1.remark}}</p>
						</div>					
					</div>				
				</div>				
			</div>
		</van-pull-refresh>
		
		
	</div>
</template>

<script type="text/javascript">	
	const cId = localStorage.getItem("cIdS");

	var pageNum=1;
	export default{
		data:function(){
			return{			
				refreshLoading: false,//下拉刷新

				sendMsg:[],//配送信息
				newOrderList:[],//新订单、催单						
				orderState:"",//订单状态
				orderStateArr:[],//订单状态列表
				orderDesArr:[],//订单详情列表
				mealAutoChecked:true,//自动出餐	
											
				allMsgData:[],//订单信息+配送信息
			};
		},
	
		methods:{
					
			//配送方式判断
			judgeMealMode(e){
			    var mealMode ="";//配送方式
			    if(e==1){
			      mealMode = "到店自提";
			    }else if(e==2){
			      mealMode = "外卖配送";
			    }else{
			      mealMode = "到店用餐";
			    }   
			    return  mealMode      
			 },
      			
			//点击展开详情
			openDetile(e,index){
				console.log()
				if(e=="process"){
					this.allMsgData[index].processBox=!this.allMsgData[index].processBox;													
				}else{
					this.allMsgData[index].goodsBox=!this.allMsgData[index].goodsBox;		
				}
			},
    								
			// 订单类型切换
			orderTab(e){
				var _this=this;
				pageNum=1;
				_this.newOrderList=[];
				
				_this.orderTabNum=e;
				// 若果切换状态为1，加载进行中订单
				if(_this.orderTabNum==1){
				
				}
				// 若果切换状态为2，加载已完成订单
				if(_this.orderTabNum==2){
					
				}
				// 若果切换状态为3，加载已取消订单
				if(_this.orderTabNum==3){
				
				}
			},

			//获取订单配送信息
			async getOrderMode(){						
				for(var i =0;i<this.newOrderList.length;i++){
					await this.$get('getOrderMode',{orderNo : this.newOrderList[i].orderNo}).then(res=>{
						this.sendMsg.push(res.data)
					}).catch(err=>{
						
					})				
				}							
				// this.buildAllMsgData()
			},
			
			//获取订单状态列表
			async getOrderState(){
				for(var i =0;i<this.newOrderList.length;i++){
					await this.$get('getOrderState',{orderNo : this.newOrderList[i].orderNo}).then(res=>{
						this.orderStateArr.push(res.data)
					}).catch(err=>{
						
					})				
				}				
			},
							   	  
			//获取已取消订单
			async getCancel(){					
				await this.$get('getOrderCancel',{sellerId:this.$global.sellerId,pageNum:1,pageSize:10}).then(res=>{					
					if(res.status=="200"){	
						res.data.list.forEach(item=>{
							this.newOrderList.push(item)							
						})	
					}						
				}).catch(err=>{
					
				})
				this.getOrderMode();	//获取订单配送信息
				this.getOrderState();  //获取订单状态列表
				this.getOrderDes();  //获取订单详情列表
			},	
					
			//获取订单详情
			async getOrderDes(){
				for(var i =0;i<this.newOrderList.length;i++){
					await this.$get('getOrderMsg',{orderNo : this.newOrderList[i].orderNo}).then(res=>{	
						var totalFee = res.data.totalAmount;//小计
						var deliveryFee = res.data.deliveryFee;//配送费
						var serveFeeRate = res.data.serviceFee ;//平台服务费率
						var serveFee = (totalFee - deliveryFee)*(serveFeeRate/100);//平台服务 = （小计-配送费）*服务费率（百分比）								
						var sellerGet = (totalFee - deliveryFee - serveFee) ;//商家所得 = (小计-配送费-平台服务费)
						res.data.serveFeeMoney = serveFee;
						res.data.sellerGet = sellerGet;
						this.orderDesArr.push(res.data)
					}).catch(err=>{
						
					})				
				}
				this.buildAllMsgData();//数据融合			
			},
			
			//数据融合
			buildAllMsgData(){
				let data =  []
				for(var i =0;i<this.newOrderList.length;i++){
					//msg1=订单列表; msg2=配送信息; msg3=订单状态 
					var greenFeeAll = 0;//每条订单的总配送费
					this.newOrderList[i].goods.forEach(item=>{
						greenFeeAll = greenFeeAll*1 +item.gGreenFee*item.buyCount*1
					})
					data.push({msg1:this.newOrderList[i],msg2:this.sendMsg[i],msg3:this.orderStateArr[i],msg4:this.orderDesArr[i],processBox:false,goodsBox:false,greenFeeAll:greenFeeAll})
					
				}
				data.forEach(item=>{
					this.allMsgData.push(item)
				})	
				console.log(this.allMsgData)			
			},
				
			// 下拉刷新
			onRefresh() {
				  pageNum=1;
				  this.newOrderList=[];
					if(this.orderTabNum==1){
						this.getNewOrder(pageNum);
						setTimeout(()=>{
							this.$toast('新订单已刷新');
							this.refreshLoading = false;
						},100)						
					}
					if(this.orderTabNum==2){
						this.getCuiOrder(pageNum);
						setTimeout(()=>{
							this.$toast('催单已刷新');
							this.refreshLoading = false;
						},100)						
					}
				},
				
			 //判断状态
			judgeState(e) { 
				var state ="";
				switch(e){
					case 0:
						state = "客户取消订单";
						break;
					case 1:
						state = "客户提交订单";
						break;
					case 2:
						state = "客户已付款";
						break;
					case 3:
						state = "商家取消订单";
						break;
					case 4:
						state = "商家接单";
						break;
					case 5:
						state = "配送员已接单";
						break;
					case 6:
						state = "配送员已转单";
						break;
					case 7:
						state = "商家已出餐";
						break;
					case 8:
						state = "配送员已取餐";
						break;
					case 9:
						state = "配送员已送达";
						break;
					case 10:
						state = "用户已评价";
						break;
				}
				return state;
			},
			
		},
		
	}
</script>
<style type="text/css" scoped>
.big-btn-wrap{margin: 0 15px;}
.head-wrap img{width: 70px;height: 70px;border-radius: 50%;}
.head-wrap{text-align: center;border-bottom: 1px solid #eee;padding: 20px 0;}
.head-wrap p{margin-top: 5px;}

.head-set{margin-top: 20px;}
.head-set p{line-height: 2em;padding: 4px 20px;}
.head-set p .iconfont{color: #F4BE42;margin-right: 10px;}

.order-tab{position: fixed;width: 100%;line-height: 45px;left: 0;top: 40px;display: flex;box-sizing: border-box;z-index: 2;padding-bottom: 5px;}
.order-tab div{flex: 1;text-align: center;background-color: #fff;}
.order-tab div.active{background-color: #FDF2D9;}
.order-tab div.active .iconfont{color: #F4BE42;}
.order-tab .iconfont{margin-right: 4px;font-size: 20px;vertical-align: middle;}

.order-detail p ,.order-detail div{line-height: 25px;}
.icon-tab{color:#D2D2D2;}
.order-detail{background: white;}
.detail-title{padding: 10px;font-size: 15px;color: #333;font-weight: bold;box-sizing: border-box;border-bottom:1px solid #F6F6F6;}
.detail-sendmsg, .detail-process, .goods-des{padding: 8px 18px;}
.font-title{font-weight:bold ;}
.detail-sendmsg, .detail-process, .goods-des{border-bottom:1px solid #F6F6F6;}
.detail-sendmsg p {line-height: 22px;}
.phone{color:#F4BE42}
.msg-text{float: left;}
.msg-address{margin-left: 70px;}
.msg-orderNo{margin-left: 60px;}
.msg-remark{margin-left: 50px;text-align: right;}
.process-title ,.goods-title{display: flex;justify-content: space-between;}
.goods-list-item{display: flex;justify-content: space-between;}
.process-content li, .goods-list-item li, .goods-list>p{display: flex;justify-content: space-between;}
.goods-item-number{margin-right: 35px;}
.times{color: #727272;}
.icon-jiantou9{color: #B1B1B1;margin-left: 5px;font-size: 14px;}
.button-group{background: white;text-align: right;padding: 12px;border-bottom: 1px solid #F6F6F6;}
.operate-btn{border: 1px solid #D2D2D2;border-radius: 5px;line-height: 25px;height: 25px;display: inline-block;width: 70px;text-align: center;font-size: 12px;}
.operate-btn:not(:last-of-type){margin-right: 10px;}
.operate-btn:active{opacity: 0.8;}
.icon-dayin{font-size: 24px;vertical-align: -4px;}



</style>