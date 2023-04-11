<template>
	<div class="index" style="padding-bottom: 45px;">
		<!-- 顶部 -->
		<div class="top">
			<p class="shop-state"><img :src="shopStateImg" alt=""><span>{{businessState}}</span></p>
			<p class="shop-name"><span>{{windowName}}({{windowAddress}})</span></p>
		</div>

		<!-- 设置框 -->
		<div class="seting-box">
			<div class="seting">				
				<div class="seting-item" @click="toWindowSet">
					<img src="../../assets/image/set_chuangkou.png" alt="">
					<p>窗口设置</p>
				</div>	
				<div class="seting-item" @click="toOrderset">
					<img src="../../assets/image/set_dingdan.png" alt="">
					<p>订单设置</p>
				</div>
				<div class="seting-item" @click="toPrintSet">
					<img src="../../assets/image/set_dayin.png" alt="">
					<p>打印设置</p>
				</div>
				<div class="seting-item">
					<img src="../../assets/image/set_lingsheng.png" alt="">
					<p>消息和铃声</p>
				</div>
				<div class="head-box"><img class="head-img" :src="windowPic==''?windowDefaultImg:port+windowPic" alt=""></div>
			</div>
		</div>
		
		<!-- 功能框 -->
		<div class="operate-box">
			<div class="operate">
				<van-cell-group>
					<div class="vant-cell-item" @click="serveShow=true">
						<van-cell title="商家服务中心" is-link />
						<img src="../../assets/image/operate_fuwu.png" alt="">
					</div>
					<div class="vant-cell-item" @click="toFeedBack">
						<van-cell title="产品意见反馈" is-link />
						<img src="../../assets/image/operate_fankui.png" alt="">
					</div>
					<div class="vant-cell-item">
						<van-cell title="当前账号" is-link value="123456dcv" />
						<img src="../../assets/image/operate_zhanghao.png" alt="">
					</div>
					<div class="vant-cell-item">
						<van-cell title="检查更新" is-link value="当前版本 V4.51.0.801" />
						<img src="../../assets/image/operate_gengxin.png" alt="">
					</div>			 					
				</van-cell-group>
				<div class="btn-box">
					<van-button @click="logOutBtn" type="primary" size="large">退出登录</van-button>
				</div>				
			</div>
		</div>	
		
		<!-- 服务中心电话弹窗层 -->
		<div class="servePopup">
			<van-popup v-model="serveShow">      
				<a id="servePopupPhone" href="tel:13673910755">{{orderPhone}}</a>
				<a id="servePopupClose" @click="serveShow=false" >关闭</a>        
		  </van-popup> 
		</div>
						
	</div>
</template>

<script type="text/javascript">
	import winImg from "../../assets/image/default_head.png";//引入默认头像
	import shopOpenPic from "../../assets/image/shop_open.png";//引入营业中图片
	import shopClosePic from "../../assets/image/shop_close.png";//引入休息中图片
	export default{
		name:"feedBack",
		data:function(){
			return{
				serveShow:false,//展示服务中心电话弹窗				
				feedBackShow:false,//展示产品意见反馈弹窗															
				port:'http://192.168.1.252:9001',//链接
				windowName:"",//窗口名称
				windowAddress:"",//窗口地址
				windowPic:"",//窗口图片
				windowDefaultImg:winImg,//窗口默认图片												
				orderPhone:"",//订单电话、商家服务中心电话			
				businessState:"营业中",//商家状态
				shopStateImg:shopOpenPic,//营业状态图片				
			};
		},
					
		methods:{
			//跳转到窗口设置页面
			toWindowSet(){
				this.$router.push({path:"/windowSet"})
			},
			
			//跳转到订单设置页面
			toOrderset(){
				this.$router.push({path:"/orderSet"})
			},			
			
			//跳转到打印设置页面
			toPrintSet(){
				this.$router.push({path:"/printSet"})
			},	
					
			//跳转到产品意见反馈页面
			toFeedBack(){
				this.$router.push({path:"/feedBack"})
			},			
		
			//退出登录
			logOutBtn(){
				this.$dialog.confirm({
				  title: "确定退出？",
				}).then(() => {
				   this.$post("logOut",{}).then(res=>{				   
				   	if(res.status==200){
				   		this.$toast("退出成功");
				   		this.$router.push({'path':'/login'})
				   		localStorage.clear();
				   	}					
				   }).catch(err=>{
				   	console.log(err)
				   })
				}).catch(() => {
				    // on cancel
				});							
			},

		},
		created(){			
			let sellerIdData = {sellerId :this.$global.sellerId}
			//获取商家信息	
			this.$get('getUserMsg',sellerIdData).then((res)=>{					
					res = res.data
					this.orderPhone = res.orderPhone;
					this.windowAddress = res.windowAddress;
					this.businessState = res.businessState==0?"营业中":"休息中";
					this.shopStateImg = res.businessState==0?shopOpenPic:shopClosePic;
					this.windowName = res.windowName;					
					this.windowPic = res.windowPic;					
				}).catch((err)=>{
					console.log(err)
				})			
		}
	}
</script>
<style type="text/css" scoped>
	.index{position: relative;}
	.popup-header .back{width:auto;}
	.popup-header .back i{font-size: 16px;}
	.popup-header .head-operate{position: absolute;width: 55px;height: 40px;text-align: center;line-height: 40px;right: 0;top: 0;font-size: 16px;}
	.top{width: 100%;height:170px;background: #F4BE42;color:white;text-align: center;box-sizing: border-box;padding-top: 30px;}
	.shop-state{font-size: 17px;font-weight: bold;margin: 0 100px 10px 100px;}
	.shop-state img{width: 21px;height:21px;margin-right: 10px;vertical-align: -2px;}
	.shop-name{font-size: 16px;font-weight: bold;padding:0 15px;}

	.seting-box, .operate-box{display: flex;justify-content: center;}
	.seting-box{margin-bottom: 5px;margin-top: -23px;position: relative;}
	.seting{display: flex;width:94%;background: white;border-radius: 5px;height: 130px;padding-top: 55px;box-sizing: border-box;}
	.seting-item{text-align: center;flex:1;}
	.seting-item img{width: 28px;height: 28px;display: inline-block;}
	.seting-item p{font-size: 13px;color:#333333;margin-top: 5px;}

	.head-box {background: white;border-radius: 50%;position: absolute;top: -40px;left: 50%;transform: translateX(-50%);}
	.head-box img{display: inline-block;width:76px;height:76px;margin: 3px;border-radius: 50%;}
	.operate{padding-bottom: 15px;background: white;width:94%;border-radius: 5px;padding:5px;box-sizing: border-box;}
	.operate .van-cell{padding: 10px 8px;}
	.operate .van-cell__title span{color:#333333;margin-left: 30px;}
	.operate .van-cell__value span{color:#333333;}
	.vant-cell-item{position: relative;}
	.vant-cell-item img{display: inline-block;width: 18px;height:18px;position: absolute;z-index: 2;top: 12px;left: 16px;}

	.btn-box{text-align: center;margin-top: 40px;margin-bottom: 15px;}
	.btn-box .van-button--large {width: 95%;height: 45px;line-height:45px;border-radius: 5px;}
	.btn-box .van-button--primary{background:#F4BE42 ;border-color:#F4BE42;}
	.btn-box .van-button--primary span{color:#333333;font-size: 16px;}
	.van-hairline--top-bottom::after{border:0;}

	.servePopup .van-popup{background: rgba(255, 255, 255, 0);}
	.servePopup .van-popup--center{top:85%;width:83%;}
	.servePopup #servePopupPhone, .servePopup #servePopupClose{display: block;color:#333333;border-radius: 6px;width: 100%;height:45px;line-height: 45px;text-align: center;}
	.servePopup #servePopupPhone{background: rgba(255, 255, 255, 0.8);margin-bottom: 10px;}
	.servePopup #servePopupClose{background: rgba(255, 255, 255, 0.95);}

	
</style>