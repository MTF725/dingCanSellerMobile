<template>
	<div class="index" style="padding-bottom: 45px;">
		<!-- 顶部 -->
		<div class="top">
			<div class="top-content">
				<div class="top-title"><img src="../../assets/image/tongji.png" alt=""><span style="margin-left:5px;">今日营业统计</span></div>
				<div class="top-datas">
					<div class="top-datas-item">
						<p>{{sellerGetToday}}</p>
						<p>营业额</p>
					</div>
					<div class="top-datas-item">
						<p>{{sellerOrderToday}}</p>
						<p>订单数</p>
					</div>
					<div class="money-text">￥</div>
				</div>
			</div>
		</div>
	
		<!-- 门店管理 -->
		<div class="part">
			<div class="part-title">门店管理</div>
			<van-grid square :column-num = "3">
				<van-grid-item @click="toGoodsManage">
					<img class="part-img" src="../../assets/image/shop_shangpin.png" alt="">
					<p>商品管理</p>
				</van-grid-item>
				<van-grid-item @click="toComments">
					<img class="part-img" src="../../assets/image/shop_userComments.png" alt="">
					<p>用户评价</p>
				</van-grid-item>
				<van-grid-item @click="toOrder">
					<img class="part-img" src="../../assets/image/shop_order.png" alt="">
					<p>账单</p>
				</van-grid-item>
				<van-grid-item @click="toSendSet">
					<img class="part-img" src="../../assets/image/shop_send.png" alt="">
					<p>配送</p>
				</van-grid-item>
				<van-grid-item @click="toNoticeMsg">
					<img class="part-img" src="../../assets/image/shop_notice.png" alt="">
					<p>公告信息</p>
				</van-grid-item>
			</van-grid>
		</div>
		
		<!-- 门店推广 -->
		<div class="part">
			<div class="part-title">门店推广</div>
			<van-grid square :column-num = "3">
				<van-grid-item>
					<img class="part-img" src="../../assets/image/shop_activity.png" alt="">
					<p>活动报名</p>
				</van-grid-item>
				<van-grid-item>
					<img class="part-img" src="../../assets/image/shop_refund.png" alt="">
					<p>极速退款</p>
				</van-grid-item>
				<van-grid-item>
					<img class="part-img" src="../../assets/image/shop_finish.png" alt="">
					<p>门店装修</p>
				</van-grid-item>
				<van-grid-item>
					<img class="part-img" src="../../assets/image/shop_acitvityConfig.png" alt="">
					<p>活动配置</p>
				</van-grid-item>			
		    </van-grid>
		</div>
		 
	</div>			
</template>

<script type="text/javascript">
	
	export default{
		name:"shopOperation",
		data:function(){
			return{			
				sellerGetToday:0,//营业额
				sellerOrderToday:0,//订单数
			};
		},
		
		methods:{
			//进入配送页面
			toSendSet(){
				this.$router.push({path:"/sendSet"})
			},
			
			//进入公告信息页面
			toNoticeMsg(){
				this.$router.push({path:"/noticeMsg"})
			},
			
			//进入用户评价页面
			toComments(){
				this.$router.push({path:"/comments"})
			},
			
			//进入账单页面
			toOrder(){
				this.$router.push({path:"/order"})
			},
			
			//进入商品管理页面
			toGoodsManage(){
				this.$router.push({path:"/goodsManage"})
			},													  
		},
		
	}
</script>
<style type="text/css" scoped>
	.index{position: relative;overflow: hidden;}
	.popup-header .back{width:auto;}
	.popup-header .back i{font-size: 17px;}
	.popup-header .head-operate{position: absolute;width: 55px;height: 40px;text-align: center;line-height: 40px;right: 0;top: 0;font-size: 17px;}
	.top{width: 100%;height:170px;background: #F4BE42;color:#333333;box-sizing: border-box;padding:20px 15px 15px 15px;box-sizing: border-box;}
	.top-content{background: white;width: 100%;height: 100%;padding: 20px;box-sizing: border-box;border-radius: 8px;position: relative;}
	.top-title{font-size: 15px;margin-bottom: 10px;}
	.top-title img{display: inline-block;width: 18px;height: 18px;}
	.top-datas{display: flex;}
	.top-datas-item{width: 50%;box-sizing: border-box;text-align: center;}
	.top-datas-item p:first-of-type{font-size: 25px;margin-bottom: 5px;}
	.top-datas-item p:last-of-type{font-size: 14px;}
	.top-datas-item:first-of-type{border-right:1px solid #E2E2E2;}
	.money-text{font-weight: heavy;color:#F4BE42;font-size: 145px;opacity: 0.1;position: absolute;right:-27px;bottom:-48px;}
	
	.part{background: white;}
	.part-title{padding: 10px;font-size: 15px;color: #333333;font-weight: bold;}
	.part-img{width: 40px;height:40px;display: inline-block;margin: 10px 0 15px 0;}
	.part p {font-size: 14px;color: #666666;}

</style>