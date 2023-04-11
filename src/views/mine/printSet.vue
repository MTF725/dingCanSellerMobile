<template>
	<!-- 打印设置弹窗层 -->
	<div class="printPopup">
		<!-- 顶部导航 -->
		<van-nav-bar title="打印设置" left-text="我的" fixed placeholder right-text="" left-arrow @click-left="navTopBack"/>	
		<!-- popup内容区 -->
		<div class="popup-main" style="height: calc(100% - 40px);">
			<!-- 打印设置上部 -->
			<div class="print-top">
				<p class="print-top-title">蓝牙打印机</p>	
				<van-cell-group>	
					<van-cell is-link title="蓝牙打印机" value="未连接"  />				
					<van-cell center title="自助打印小票">
						<template #right-icon>
							<van-switch :value="autoPrint" size="18" @input="autoPrintChange"  :loading="autoPrintLoading" active-color="#86C06C"/>
						</template>
					</van-cell>										
				</van-cell-group>	
			</div>
			<!-- 打印设置上部 -->
			<div class="print-top">
				<p class="print-top-title">GPRS/WIFI打印机</p>	
				<van-cell-group>	
					<van-cell is-link title="打印机" value="添加打印机"  />													
				</van-cell-group>	
			</div>
		</div>
		
	</div>
</template>

<script type="text/javascript">
	export default{
		name:"printSet",
		data:function(){
			return{									
				autoPrint:true,//自动打印
				autoPrintLoading:false,//自主打印等待动画
			};
		},
		methods:{
			//返回键
			navTopBack(){
				this.$router.go(-1)
			},
			
			//自动打印
			autoPrintChange(e){
				this.autoPrintLoading = true;
				this.$toast.loading({
					message: '提交中...',
					duration: 0,
					forbidClick: true,
					loadingType: 'spinner',
				});		
				this.$post("editAutoPrint",{sellerId :this.$global.sellerId ,stateId :e?"1":0}).then(res=>{
					console.log(res)
					if(res.status==200){
						this.autoPrint=e;
						this.$toast("修改成功")
					}
					this.autoPrintLoading = false;
				}).catch(err=>{
					console.log(err)
					this.autoPrintLoading = false;
				})
			},		
		},
		created(){				
			 let sellerIdData = {sellerId :this.$global.sellerId}
			 //获取商家信息	
			 this.$get('getUserMsg',sellerIdData).then((res)=>{
					console.log("获取商家信息",res.data)
					res = res.data
				
					this.autoPrint = res.autoPrintState==0?false:true;			
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
    .print-top{background: white;}
    .print-top-title{background: #EEEEEE;padding: 10px 17px;}
</style>