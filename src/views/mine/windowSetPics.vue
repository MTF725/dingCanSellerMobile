<template>
	<!-- 窗口图片弹窗层 -->
	<div class="winPicPopup" style="height: 100%;">
		<!-- 顶部导航 -->
		<van-nav-bar :title="fromBtn" left-text="窗口设置" fixed placeholder right-text="" left-arrow @click-left="navTopBack" />	
		<!-- popup内容区 -->
		<div class="popup-main" style="height: calc(100% - 40px);">
			<div class="msg-box2">
				<ul class="pic-list">
					<li v-for="(item,index) in picArr" :key="index">
						<img @click="openImg(index)" class="img-item" :src="item.picUrl" alt="">
						<img class="del-btn" @click="delPic(item.picId)" src="../../assets/image/del-img.png" alt="">
					</li>						 
				</ul>
				<van-uploader :after-read="uploadImg" v-show="showAddBtn">							
					<div><img class="camera-img" src="../../assets/image/camera.png" alt=""></div>					
				</van-uploader>								
			</div>
		</div>	
		
		<van-image-preview v-model="previewShow" :images="picPreArr" @change="previewChange">
		  <template v-slot:index>第{{ index }}页</template>
		</van-image-preview>
	</div> 
	
</template>

<script type="text/javascript">
	import winImg from "../../assets/image/default_head.png";//引入默认头像
	import { ImagePreview } from 'vant';
	export default{
		name:"windowSetPics",
		data:function(){
			return{
				port:'http://192.168.1.252:9001',//链接			
				picArr:[],//图片数据数组
				picPreArr:[],//图片预览数组
				index:0,//第几页
				fromBtn:"",//从哪个按钮跳转过来
				previewShow:false,//图片预览组件
				showAddBtn:true,//显示图片添加按钮
			};
		},
		mounted() {
			 //滚动到底加载更多
			  window.addEventListener('scroll',this.reachBottom)			  
		},	
		methods:{
			//返回键
			navTopBack(){
				this.$router.go(-1)
			},
			
			//图片查询
			getPics(){
				this.picArr=[];
				this.picPreArr=[];
				let url = "";
				console.log(this.fromBtn)
				if(this.fromBtn == "窗口图片"){
					url = "getChuangKou";
				}else if(this.fromBtn == "资质证照"){
					url = "getZiZhi";
				}else if(this.fromBtn == "员工健康证"){
					url = "getYuanGong";
				}				
				this.$get(url,{sellerId: this.$global.sellerId}).then(res=>{			
					res.data.forEach(item=>{
						item.picUrl = this.port+item.picUrl;
						this.picPreArr.push(item.picUrl)
						this.picArr.push(item)
						this.picLimit();//图片数量限制
					})
				}).catch(err=>{
					console.log(err)
				})
				console.log(this.picArr)
			},
			     
			// 上传图片
			uploadImg(e){
				let formData=new FormData();
				formData.append('file',e.file);	
				let url = "";
				if(this.fromBtn == "窗口图片"){
					url = "addChuangKouPic";
				}else if(this.fromBtn == "资质证照"){
					url = "addZiZhiPic";
				}else if(this.fromBtn == "员工健康证"){
					url = "addYuanGongPic";
				}				
							
				this.$fromDataPost("getWinPicUrl",formData).then(res=>{				
					if(res.status == 200){					
						let data = {
							sellerId :this.$global.sellerId,
							picUrl  :res.data
						}								
						this.$toast.loading({
							message: '上传中...',
							duration: 0,
							forbidClick: true,
							loadingType: 'spinner',
						});		
						this.$post(url,data).then(res2=>{
							console.log(res2)
							if(res2.status==200){
								load.clear();
								this.$toast('上传成功');
								this.getPics();//获取图片
							}
						}).catch((err2)=>{
							console.log(err2)
						})				
					}		
				}).catch((err)=>{

				})				
			},

			//图片预览
			openImg(e){						
				ImagePreview({
					images: this.picPreArr, // 预览图片的那个数组
					showIndex:true,
					loop:false,
					startPosition:e, // 指明预览第几张图
					closeable: true,
				});
			},
			
			//预览图片改变时
			previewChange(index){
				this.index = index;
			},
			
			//删除图片
			delPic(e){				
				let url = "";
				if(this.fromBtn == "窗口图片"){
					url = "delChuangKou";
				}else if(this.fromBtn == "资质证照"){
					url = "delZiZhi";
				}else if(this.fromBtn == "员工健康证"){
					url = "delYuanGong";
				}	
				this.$toast.loading({
					message: '提交中...',
					duration: 0,
					forbidClick: true,
					loadingType: 'spinner',
				});		
				this.$delArr(url,{picId: e}).then(res=>{
					if(res.status==200){
						this.$toast('删除成功');
						this.getPics();//获取图片
					}			
				}).catch(err=>{
					console.log(err)
				})	
						
			},
			
			//图片数量限制
			picLimit(){
				if(this.picPreArr.length>=9){
					this.showAddBtn=false;
				}
			}
			
		},
		created(){				
			this.fromBtn = this.$route.query.fromBtn;		
			this.getPics();//获取图片
		},
		
	}
</script>
<style type="text/css" scoped>		
	/deep/ .van-nav-bar{background: #F4BE42;}
	/deep/ .van-nav-bar .van-icon{color: #333333;}
	/deep/ .van-nav-bar .van-nav-bar__text{color: #333333;}
	/deep/ .van-nav-bar__left, .van-nav-bar__right{padding: 0px 7px;}
	
	.msg-box2{background: white;padding: 10px;width: 100%;box-sizing: border-box;}
	.pic-list{margin-bottom: 10px;display: flex;align-items: center;justify-content: space-between;flex-wrap: wrap;}
	.pic-list li{margin-bottom:5px;position: relative;}
	.camera-img{width: 80px;height:80px;}
	.img-item{width:160px;height:160px;}
	
	.del-btn{position: absolute;top: 0;right:0;height:10px!important;width: 10px!important;padding: 5px 6px;
	 background: #B4B4B4;cursor: pointer;}
</style>