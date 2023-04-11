<template>	
	<!-- 订单设置弹窗层 -->
	<div class="orderSetPopup">			
		<!-- 顶部导航 -->
		<van-nav-bar title="订单设置" left-text="我的" fixed placeholder right-text="保存" left-arrow @click-left="navTopBack" @click-right="autoAcceptConfirm" />	
		<!-- popup内容区 -->
		<div class="popup-main" style="height: calc(100% - 40px);">
			<!-- 订单设置上部 -->
			<div class="order-top">	
				<van-cell-group>					
					<van-cell center title="手机自动接单">
						<template #right-icon>
							<van-switch v-model="outoAcceptOrder" size="18" active-color="#86C06C"/>
						</template>
					</van-cell>			
					<van-cell is-link title="自动接单开始时间" :value="autoBeginTime" @click="autoBegin('自动接单开始')" />
					<van-cell is-link title="自动接单结束时间" :value="autoEndTime" @click="autoEnd('自动接单结束')" />
				</van-cell-group>	
			</div>			
			<!-- 订单设置下部 -->
			<div class="order-bottom">
				<van-cell-group>
					<van-cell title="Andro系统版本需高于4.3" center  />					
					<van-cell title="需授权通知使用权" center />							
					<van-cell title="需链接蓝牙打印机" center value="去链接" is-link />							  									    
					<van-cell title="需设置不自动锁屏" center value="去开启" is-link />							 								        										
				</van-cell-group>	
				<div class="set-des">
					<p>1.保证打印机不缺纸</p>
					<p>2.保证系统前台运行</p>
					<p>3.请勿锁屏，否则将影响自动接单</p>
					<p>4.自动接单仅对此设备生效</p>
				</div>
			</div>
		</div>
			
		<!-- 时间选择popup -->
		<van-popup v-model="timeSelectShow" position="bottom" :style="{width:'100%', height: '270px'}">
			<van-datetime-picker v-on:confirm="setTime" v-on:cancel="timeSelectShow=false"  type="time" title="选择时间" />
		</van-popup>
	</div> 							
</template>

<script type="text/javascript">
	import { Toast } from 'vant';
	export default{
		name:"orderSet",
		data:function(){
			return{		
				outoAcceptOrder:true,//自动接单				
				timeType:"",//时间类型 
				timeSelectShow:false,//展示时间选择弹窗 
				autoBeginTime:"",//自动接单开始时间
				autoEndTime:"",//自动接单结束时间		
			};
		},
		
		methods:{		
			//返回键
			navTopBack(){
				this.$router.go(-1)
			},
			
			//自动接单确定
		    autoAcceptConfirm(){				
				//时间校验
				if(this.autoBeginTime==""&&this.autoEndTime!=""){
				  this.$toast("请输入自动接单开始时间");
				  return;
				}
				if(this.autoBeginTime!=""&&this.autoEndTime==""){
				  this.$toast("请输入自动接单结束时间");
				  return;
				}			
				if(this.autoBeginTime!=""&&this.autoEndTime!=""&&this.$getSecond(this.autoBeginTime)>=this.$getSecond(this.autoEndTime)){
					this.$toast("自动接单开始时间不能大于结束时间")
					return
				}				
				let data = {
					sellerId : this.$global.sellerId ,
					autoStateId : this.outoAcceptOrder?"1":"0" ,
					beginTime : this.autoBeginTime ,
					endTime : this.autoEndTime 
				}
				this.$toast.loading({
					message: '提交中...',
					duration: 0,
					forbidClick: true,
					loadingType: 'spinner',
				});		
				this.$post("editAcceptTime",data).then(res=>{					
					if(res.status==200){
						this.$toast("保存成功")
					}					
				}).catch(err=>{					
					console.log(err)
				})
			},
		
			//确定时间
			setTime(e){		
				console.log("选定时间",e,"时间类型",this.timeType)
				switch(this.timeType){					
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

			//自动接单开始
			autoBegin(e){			
				this.timeSelectShow = true;
				this.timeType = e		
			},
			
			//自动接单结束
			autoEnd(e){
				this.timeSelectShow = true;
				this.timeType = e		
			},
			
		},
		created(){				
			let sellerIdData = {sellerId :this.$global.sellerId}
			//获取商家信息	
			this.$get('getUserMsg',sellerIdData).then((res)=>{
				console.log("获取商家信息",res.data)
				res = res.data			
				this.outoAcceptOrder = res.orderAutoAccept==0?false:true;
				this.autoBeginTime = res.orderBeginTime;
				this.autoEndTime  = res.orderEndTime;							
			}).catch((err)=>{
				console.log(err)
			})		
		}
	}
	
</script>
<style type="text/css" scoped>
	/deep/ .van-nav-bar{background: #F4BE42;}
	/deep/ .van-nav-bar .van-icon{color: #333333;}
	/deep/ .van-nav-bar .van-nav-bar__text{color: #333333;}
	/deep/ .van-nav-bar__left, .van-nav-bar__right{padding: 0px 7px;}

	.order-top{background: white;margin-bottom: 5px;}
	.switch-box{margin-bottom: 10px;display: flex;justify-content: space-between;align-items: center;}
	.switch-box span{font-size: 15px;}
	.switch-alert{font-size: 12px;}
	.set-des{background: white;padding: 10px 15px;border-top: 1px solid #ebedf0!important;}
	.set-des p{color:#9B9B9B;margin-bottom: 5px;}

</style>