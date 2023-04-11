<template>
	<!-- 窗口设置弹窗层 -->
	<div class="windowSetPopup">
		<!-- 顶部导航 -->
		<van-nav-bar title="窗口设置" left-text="我的" fixed placeholder right-text="" left-arrow @click-left="navTopBack" />	
		<!-- popup内容区 -->
		<div class="popup-main" style="height: calc(100% - 46px);">	
			<div class="van-cell-part">
				<!-- 订单设置上部 -->
				<div class="order-top">	
					<van-cell-group>					
						<van-cell center title="营业状态">
							<template #right-icon>
								<van-switch :value="stateSwitch" size="18" active-color="#86C06C" @input="stateSwitchChange" :loading="stateSwitchLoading" />
							</template>
						</van-cell>			
					</van-cell-group>	
				</div>		
			</div>
			<div class="van-cell-part">
				<van-cell-group>
					<van-cell title="窗口名称" center :value="windowName" @click="windowNameShow = true" is-link />					
					<van-cell title="窗口号" center :value="windowNo" is-link />							
					<van-cell title="窗口二维码" center is-link>							  
						<template #default>
							<img class="right-img" :src="windowQRCode"  alt="">							
						</template>
					</van-cell>	
					<van-cell title="窗口头像" center is-link>							 
						<template #default>
							<van-uploader :after-read="uploadWinImg">
								<img class="right-img" :src="windowPic==''?windowDefaultImg:port+windowPic" alt="">								
							</van-uploader>							
						</template>
					</van-cell>								
				</van-cell-group>
			</div>

			<div class="van-cell-part">
				<van-cell-group>
					<van-cell title="营业时间" center :value="businessTime" @click="timeSetShow=true" is-link />	
					<van-cell title="订餐电话" center :value="orderPhone" @click="windowPhoneShow=true" is-link />	
					<van-cell title="窗口地址" center :value="windowAddress" is-link />																
				</van-cell-group>
			</div>	

			<div class="van-cell-part">
				<van-cell-group>
					<van-cell title="窗口图片" center  @click="toWindowSetPics('窗口图片')" is-link />	
					<van-cell title="资质证照" center  @click="toWindowSetPics('资质证照')"  is-link />		
					<van-cell title="员工健康证" center @click="toWindowSetPics('员工健康证')" is-link />															
				</van-cell-group>
			</div>

			<div class="van-cell-part">
				<van-cell-group>
					<van-cell title="起送" center :value="deliveryMinAmount" @click="beginFeeShow=true;" is-link />												 					
				</van-cell-group>
			</div>								
		</div>

		<!-- 修改窗口名称弹层 -->
		<div class="windowNamePopup edit-window" :class="{showthis:windowNameShow}">		     
			<div class="edit-box">
				<input type="text" v-model="newWindowName" placeholder="请输入窗口名称">
				<div class="btns">
					<van-button  @click="editWindowNamePopup" type="primary">确定</van-button>
					<van-button  @click="windowNameShow = false" type="primary">取消</van-button>
				</div>	 
			</div>   		  
		</div>

		<!-- 修改手机号弹层 -->
		<div class="windowPhonePopup edit-window" :class="{showthis:windowPhoneShow}">		     
			<div class="edit-box">
				<input type="number" v-model="newOrderPhone" placeholder="请输入订餐电话">
				<div class="btns">
					<van-button  @click="editWindowPhonePopup" type="primary">确定</van-button>
					<van-button  @click="windowPhoneShow=false" type="primary">取消</van-button>
				</div>	 
			</div>   		  
		</div>
	   
		<!-- 修改起送费弹层 -->
		<div class="beginFeePopup edit-window" :class="{showthis:beginFeeShow}">		     
			<div class="edit-box">
				<input type="text" v-model="newDeliveryMinAmount" placeholder="请输入起送金额">
				<div class="btns">
					<van-button @click="editBeginFee" type="primary">确定</van-button>
					<van-button @click="beginFeeShow=false;" type="primary">取消</van-button>
				</div>	 
			</div>   		  
		</div>

		<!-- 修改时间弹层 -->
		<div class="beginFeePopup edit-window" :class="{showthis:timeSetShow}">		     
			<div class="edit-box3">
				<div class="time-box">
					<div class="time-item">
						<p>早餐</p>
						<div class="time-type-box">
							<div class="time-single">
								<input type="text" @click="selectTime('早餐开始')" :value="zaoTimeBegin">
								<img src="../../assets/image/clock.png" alt="">
							</div>
							<div class="time-single">
								<input type="text" @click="selectTime('早餐结束')" :value="zaoTimeEnd">
								<img src="../../assets/image/clock.png" alt="">
							</div>								  
						</div>
					</div>
					<div class="time-item">
						<p>中餐</p>
						<div class="time-type-box">
							<div class="time-single">
								<input type="text" @click="selectTime('中餐开始')" :value="zhongTimeBegin">	
								<img src="../../assets/image/clock.png" alt="">
							</div>
						  <div class="time-single">
								<input type="text" @click="selectTime('中餐结束')" :value="zhongTimeEnd">
								<img src="../../assets/image/clock.png" alt="">
							</div>								  
						</div>							
					</div>
					<div class="time-item">
						<p>晚餐</p>
						<div class="time-type-box">
							<div class="time-single">
								<input type="text" @click="selectTime('晚餐开始')" :value="wanTimeBegin">
								<img src="../../assets/image/clock.png" alt="">
							</div>	
							<div class="time-single">
								<input type="text" @click="selectTime('晚餐结束')" :value="wanTimeEnd">
								<img src="../../assets/image/clock.png" alt="">
							</div>								  
						</div>															
					</div>							
				</div>					
				<div class="btns">
					<van-button @click="editTime" type="primary">确定</van-button>
					<van-button @click="timeSetShow=false;" type="primary">取消</van-button>
				</div>	 
			</div>   		  
		</div>
		
		<!-- 窗口图片弹窗层 -->
		<div class="winPicPopup">
			<van-popup position="right" :style="{width:'100%', height: '100%',background:'#eee'}" v-model="chuangKouShow">
				<!-- popup内头部 -->
				<div class="popup-header">
					<span class="back iconfont icon-zuojiantou" v-on:click="chuangKouShow=false"><i>窗口设置</i></span>
					<span>资质证照</span>				
				</div>
				<!-- popup内容区 -->
				<div class="popup-main" style="height: calc(100% - 40px);">
					<div class="msg-box2">
						<ul class="pic-list">
							<li><img class="img-item" src="../../assets/image/camera.png" alt=""></li>							  
						</ul>
						<van-uploader :after-read="uploadChuangKou">							
							<div><img class="camera-img" src="../../assets/image/camera.png" alt=""></div>					
						</van-uploader>								
					</div>
				</div>
			</van-popup>
		</div> 
		
		<!-- 时间选择popup -->
		<van-popup v-model="timeSelectShow" position="bottom" :style="{width:'100%', height: '270px'}">   
			<van-datetime-picker v-on:confirm="setTime" v-on:cancel="timeSelectShow=false" type="time" title="选择时间" />
		</van-popup>
	
	</div>
</template>

<script type="text/javascript">
	import winImg from "../../assets/image/default_head.png";//引入默认头像
	import shopOpenPic from "../../assets/image/shop_open.png";//引入营业中图片
	import shopClosePic from "../../assets/image/shop_close.png";//引入休息中图片
	import { ImagePreview } from 'vant';
	export default{
		name:"windowSet",
		data:function(){
			return{
				port:'http://192.168.1.252:9001',//链接
				windowNameShow:false,//展示修改窗口名弹窗
				windowPhoneShow:false,//展示修改手机弹窗
				beginFeeShow:false,//展示修改起送费弹窗
				timeSetShow:false,//展示修改时间弹窗
				chuangKouShow:false,//展示窗口图片弹层
				ziZhiShow:false,//展示资质图片弹层
				yuanGongShow:false,//展示员工图片弹层
				timeSelectShow:false,//展示时间选择弹窗 
				
				stateSwitch:false,//营业状态		
				stateSwitchLoading:false,//营业状态开关等待动画
				orderPhone:"",//订单电话、商家服务中心电话
				newOrderPhone:"",//新订单电话、商家服务中心电话
				windowDefaultImg:winImg,//窗口默认图片
				windowPic:"",//窗口图片				
				windowAddress:"",//窗口地址
				businessState:"营业中",//商家状态
				shopStateImg:shopOpenPic,//营业状态图片			
				windowId:"",//窗口id
				windowName:"",//窗口名称
				newWindowName:"",//新窗口名称
				windowNo:"",//窗口号
				newWindowNo:"",//新窗口号
				windowQRCode:"",//窗口二维码
				timeType:"",//时间类型 
			
				zaoTimeBegin:"",//早餐开始时间
				zaoTimeEnd:"",//早餐结束时间				
				zhongTimeBegin:"",//中餐开始时间
				zhongTimeEnd:"",//中餐结束时间
				wanTimeBegin:"",//晚餐开始时间
				wanTimeEnd:"",//晚餐结束时间
				businessTime:"",//营业时间
				deliveryMinAmount:"",//起送费
				newDeliveryMinAmount:"",//新起送费
					
			};
		},
		mounted() {
			 //滚动到底加载更多
			  window.addEventListener('scroll',this.reachBottom)			  
		},
		//销毁监听滚动条事件
		destroyed(){
			
		},
		computed:{},
		
		methods:{
			//返回键
			navTopBack(){
				this.$router.go(-1)
				this.$router.push({path:"/mine"})
			},
			
			//跳转到窗口图片页面
			toWindowSetPics(e){
				this.$router.push({path:"/windowSetPics",query:{fromBtn:e}})
			},
			
			//营业状态切换
			stateSwitchChange(e){//1休息中，其他都是营业		
				this.stateSwitchLoading=true;			
				this.$post("updateBusinessState",{sellerId:this.$global.sellerId,stateId:e?0:1}).then(res=>{					
					if(res.status==200){						
						this.stateSwitch=e;
						if(this.stateSwitch){
							this.$toast("营业中")
						}else{
							this.$toast("休息中")
						}
					}
					this.stateSwitchLoading=false;
				}).catch(err=>{
					this.stateSwitchLoading=false;
					console.log(res)
				})		
			},
						
			//修改窗口名
			editWindowNamePopup(){			
				if(this.newWindowName==""){
					this.$toast('请输入窗口名称');
					return;
				}
				this.$toast.loading({
					message: '提交中...',
					duration: 0,
					forbidClick: true,
					loadingType: 'spinner',
				});		
				this.$post("editWinName",{winId :this.windowId,winName :this.newWindowName}).then((res)=>{
					if(res.status==200){
						  this.windowName = this.newWindowName
							this.$toast('修改成功');
							this.windowNameShow = false;
					}
				}).catch((err)=>{
					console.log(err)
				})
			},
		
			//修改手机号
			editWindowPhonePopup(){			
				if(this.newOrderPhone==""){
					this.$toast('请输入订餐电话');
					return;
				}
				if(!phongReg.test(this.newOrderPhone)){
					this.$toast('手机号格式错误');
					return;
				}
				this.$toast.loading({
					message: '提交中...',
					duration: 0,
					forbidClick: true,
					loadingType: 'spinner',
				});		
				this.$post("editOrderPhone",{sellerId:this.$global.sellerId,phone :this.newOrderPhone}).then((res)=>{
					console.log("修改窗口名",res)
					if(res.status==200){
						  this.orderPhone = this.newOrderPhone
							this.$toast('修改成功');
							this.windowPhoneShow = false;
					}
				}).catch((err)=>{
					console.log(err)
				})
			},
			
	 
			//修改起送费
			editBeginFee(){
				if(this.newDeliveryMinAmount==""){
					this.$toast('请输入起送金额');
					return;
				}
				//判断起送费是大于或等于0的数字
				if (!(posReg.test(this.newDeliveryMinAmount))) {
						this.$toast('起送费必须是大于或等于0的数字');					
						return;
				}    
				//判断小数点后最多两位
				if (!(pointTwoReg.test(this.newDeliveryMinAmount))) {
						this.$toast('小数点后最多两位');					
						return;
				}
				this.$toast.loading({
					message: '提交中...',
					duration: 0,
					forbidClick: true,
					loadingType: 'spinner',
				});		
				this.$post("editBeginFee",{sellerId :this.$global.sellerId,minAmount:this.newDeliveryMinAmount}).then((res)=>{
					console.log("修改起送费",res)
					if(res.status==200){
						  this.deliveryMinAmount = "￥"+this.newDeliveryMinAmount
							this.$toast('修改成功');
							this.beginFeeShow = false;
					}
				}).catch((err)=>{
					console.log(err)
				})
			},
		
			//确定时间
			setTime(e){								
				switch(this.timeType){
					case "早餐开始":
						this.zaoTimeBegin = e;
						break;
					case "早餐结束":
						this.zaoTimeEnd = e;
						break;
					case "中餐开始":
						this.zhongTimeBegin = e;
						break;
					case "中餐结束":
						this.zhongTimeEnd = e;
						break;
					case "晚餐开始":
						this.wanTimeBegin = e;
						break;
					case "晚餐结束":
						this.wanTimeEnd = e;
						break;
					case "自动接单开始":
						this.autoBeginTime = e;
						break;
					case "自动接单结束":
						this.autoEndTime = e;	
						break;
				}				
			  this.timeSelectShow=false    
			},
			
			//选择时间
			selectTime(e){	
				this.timeSelectShow=true;
				this.timeType = e			 
			},
			
			//上传时间
			editTime(){				
				//时间校验
				if(this.zaoTimeBegin==""&&this.zaoTimeEnd!=""){
				  this.$toast("请输入早餐开始时间");
				  return;
				}
				if(this.zaoTimeBegin!=""&&this.zaoTimeEnd==""){
				  this.$toast("请输入早餐结束时间");
				  return;
				}			
				if(this.zaoTimeBegin!=""&&this.zaoTimeEnd!=""&&this.$getSecond(this.zaoTimeBegin)>=this.$getSecond(this.zaoTimeEnd)){
					this.$toast("早餐开始时间不能大于结束时间")
					return
				}
				if(this.zhongTimeBegin==""&&this.zhongTimeEnd!=""){
				  this.$toast("请输入午餐开始时间");
				  return;
				}
				if(this.zhongTimeBegin!=""&&this.zhongTimeEnd==""){
				  this.$toast("请输入午餐结束时间");
				  return;
				}			
				if(this.zhongTimeBegin!=""&&this.zhongTimeEnd!=""&&this.$getSecond(this.zhongTimeBegin)>=this.$getSecond(this.zhongTimeEnd)){
					this.$toast("午餐开始时间不能大于结束时间")
					return
				}
				if(this.wanTimeBegin==""&&this.wanTimeEnd!=""){
				  this.$toast("请输入晚餐开始时间");
				  return;
				}
				if(this.wanTimeBegin!=""&&this.wanTimeEnd==""){
				  this.$toast("请输入晚餐结束时间");
				  return;
				}			
				if(this.wanTimeBegin!=""&&this.wanTimeEnd!=""&&this.$getSecond(this.wanTimeBegin)>=this.$getSecond(this.wanTimeEnd)){
					this.$toast("晚餐开始时间不能大于结束时间")
					return
				}
				let data = {
					sellerId :this.$global.sellerId ,
					beginTime1 :this.zaoTimeBegin ,
					endTime1 :this.zaoTimeEnd ,
					beginTime2 :this.zhongTimeBegin ,
					endTime2 :this.zhongTimeEnd ,
					beginTime3 :this.wanTimeBegin ,
					endTime3 :this.wanTimeEnd ,
				}
				this.$toast.loading({
					message: '提交中...',
					duration: 0,
					forbidClick: true,
					loadingType: 'spinner',
				});		
				this.$post('editBusiTime',data).then((res)=>{					
					if(res.status==200){
						this.businessTime = `${this.zaoTimeBegin}-${this.zaoTimeEnd},${this.zhongTimeBegin}-${this.zhongTimeEnd},${this.wanTimeBegin}-${this.wanTimeEnd}`;
						this.$toast('修改成功');
						this.timeSetShow = false;
					}
				}).catch((err)=>{
					console.log(err)
				})
			},       

			// 窗口头像
			uploadWinImg(e){									
				let formData=new FormData();
				formData.append('file',e.file);
				this.$toast.loading({
					message: '上传中...',
					duration: 0,
					forbidClick: true,
					loadingType: 'spinner',
				});		
				this.$fromDataPost("getWinPicUrl",formData).then(res=>{
					console.log(res)
					if(res.status == 200){						
						let data = {
							sellerId :this.$global.sellerId,
							winPic :res.data
						}												
						this.$post("updateWindowPic",data).then(res2=>{
							console.log(res2)
							if(res2.status==200){								
								this.$toast('上传成功');
								this.windowPic = res.data;
							}
						}).catch((err2)=>{
							console.log(err2)
						})				
					}		
				}).catch((err)=>{

				})				
			},

			//窗口图片上传
			uploadChuangKou(e) {
				// 此时可以自行将文件上传至服务器
				let pic = e.content;
				let data = {
				   sellerId :this.$global.sellerId,
					 picUrl  :pic
					}
				this.$toast.loading({
				 	message: '上传中...',
				 	duration: 0,
				 	forbidClick: true,
				 	loadingType: 'spinner',
				});		
				this.$post("addChuangKouPic",data).then((res)=>{					
					if(res.status==200){						
						this.$toast('上传成功');
						this.yuanGongPics.push(pic)
					}				
				}).catch((err)=>{
					console.log(err)
				})				
			},			
		},
		created(){				
			 let sellerIdData = {sellerId :this.$global.sellerId}
			 //获取商家信息	
			 this.$get('getUserMsg',sellerIdData).then((res)=>{
					console.log("获取商家信息",res.data)
					res = res.data
					this.orderPhone = res.orderPhone;
					this.windowAddress = res.windowAddress;
					this.businessState = res.businessState!=1?"营业中":"休息中";
					this.shopStateImg = res.businessState!=1?shopOpenPic:shopClosePic;
					this.windowName = res.windowName;
					this.windowNo = res.windowNo;
					this.windowQRCode = winPort+res.windowQRCode;
					this.windowPic = res.windowPic;
					this.businessTime = res.businessBeginTime1+"-"+res.businessEndTime1+","+res.businessBeginTime2+"-"+res.businessEndTime2+","+res.businessBeginTime3+"-"+res.businessEndTime3;
					this.zaoTimeBegin  = res.businessBeginTime1;
					this.zaoTimeEnd = res.businessEndTime1;
					this.zhongTimeBegin = res.businessBeginTime2;
					this.zhongTimeEnd = res.businessEndTime2;
					this.wanTimeBegin  = res.businessBeginTime3;
					this.wanTimeEnd  = res.businessEndTime3;
					this.windowId = res.windowId;
					this.outoAcceptOrder = res.orderAutoAccept==0?false:true;
					this.autoBeginTime = res.orderBeginTime;
					this.autoEndTime  = res.orderEndTime;
					this.autoPrint = res.autoPrintState==0?false:true;
					this.stateSwitch = res.businessState==1?false:true;//1是休息，其他都是营业
					console.log(this.windowPic )
					console.log("二维码",	this.windowQRCode )
				}).catch((err)=>{
					console.log(err)
				})

				//获取配送设置信息
				this.$get('getDeliveryMsg',sellerIdData).then((res)=>{
					console.log("获取配送设置信息",res)
					res = res.data
					this.deliveryMinAmount = "￥"+res.deliveryMinAmount;
				}).catch((err)=>{
					console.log(err)
				})				
		},
		
	}
</script>
<style type="text/css" scoped>	
	/deep/ .van-nav-bar{background: #F4BE42;}
	/deep/ .van-nav-bar .van-icon{color: #333333;}
	/deep/ .van-nav-bar .van-nav-bar__text{color: #333333;}
	/deep/ .van-nav-bar__left, .van-nav-bar__right{padding: 0px 7px;}
	/deep/ .van-nav-bar--fixed{z-index: 10;}
	
	.msg-box{display: flex;justify-content: center;margin-top:15px ;}
	.msg-box .van-cell-group{width: 90%;border:1px solid #DDDDDD}
	.windowSetPopup{position: relative;}
	.windowSetPopup .vant-cell-item{border-bottom:1px solid #ebedf0;position: relative;} 
	.windowSetPopup .vant-cell-pic .van-cell--center{height: 80px;}
	.windowSetPopup .vant-cell-item img{width:53px;height: 53px;display: inline-block;position: absolute;left: 286px;top: 12px;}
  .window-img{width:53px;height: 53px;display: inline-block;position: absolute;left: 286px;top: 12px;}
	.van-cell-part{margin-bottom: 5px;}
  
	.edit-window{position: absolute;left: 0;top: 0;right: 0;bottom: 0;width: 100%;height: 100%;display: flex;justify-content: center;display: none;}
	.edit-box , .edit-box3{width:270px;height:80px;text-align: center;padding:30px 15px;background: white;margin-top: 180px;z-index: 3; box-shadow:0 3px 5px rgba(0,0,0,0.16);}
	.edit-box input{width:90%;height: 30px;padding-left: 5px;border: 1px solid #E6E6E6;}
	.btns{margin-top:15px;}
	.btns button{width:65px;height:30px;line-height: 30px;color:#333333;}
	.btns button:first-of-type{margin-right: 10px;background-color: #F4BE42;border: 1px solid #F4BE42;}
	.btns button:last-of-type{background-color: #fff;border: 1px solid #D2D2D2;}
	.sendFeePopup input, .beginFeePopup input{width: 82%;margin-right: 10px;}
	.right-img{width: 53px;height: 53px;}		

	.msg-box2{background: white;padding: 10px;width: 100%;height:100%;}
	.pic-list{margin-bottom: 10px;}
	.camera-img{width: 80px;height:80px;}
	.img-item{width:150px;height:150px;}
	 
	.edit-box3{height: 230px;padding: 20px 15px}
	.edit-box3 input{height: 30px;padding-left: 5px;border: 1px solid #E6E6E6;margin-right: 0;}
	.time-item {margin-bottom: 10px;}
	.time-item p{text-align: left;padding-left: 10px;margin-bottom: 5px;font-weight: Regular;}
	.time-type-box{display: flex;justify-content:space-around;}
	.time-single{width: 40%;flex: 1;position: relative;}
  .time-single:nth-of-type(even){margin-left: 10px;}
	.time-single img{display: inline-block;width: 17px;height: 17px;position: absolute;right: 18px;top: 8px;}

	
</style>