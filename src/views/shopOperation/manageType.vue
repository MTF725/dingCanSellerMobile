<template>
	<!-- 分类选择弹窗层 -->
	<div class="typeChoosePopup">			
		<!-- 顶部导航 -->
		<van-nav-bar title="管理分类" left-text="商品管理" fixed placeholder right-text="" left-arrow @click-left="navTopBack" />	
		<!-- 无记录提示 -->
		<div class="no-msg" v-show="noMsg">暂无分类</div>
		<!-- popup内容区 -->
		<div class="popup-main" style="height: calc(100% - 40px);">
			<van-cell v-for="(item,index) in goodsTypeArr" :key="index" center :title="item.gKindName" @click="typeChoose(item.gKindId,item.gKindName)">	
				<template #default>
					<span @click.stop="editType(item.gKindId)" class="edit-text">编辑</span>
				</template>
			</van-cell>
			<div class="type-choose-foot-empty">
				<div class="type-choose-foot" @click="addType">
					<span class="iconfont icon-xinjian"></span><span>添加分类</span>
				</div>		
			</div>									
		</div>		
	</div>  				
</template>

<script type="text/javascript">	
	export default{
		name:"manageType",
		data:function(){
			return{			
				goodsTypeArr:[],//商品类型
				noMsg:false,//无数据提示
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
				if(this.$route.query.fromPage=="goodBuild"){
					this.$router.push({path:"/goodBuild"})
				}else{
					this.$router.push({path:"/goodsManage"})
				}
				
			},	
			
			//分类选中
			typeChoose(id, name){
				this.$router.push({path:"/goodBuild",query:{gType:name,gKindId:id}})
			},
				
			//获取商品分类列表
			getGoodsKinds(){
				this.$get("getGoodsKinds",{pageSize:100000,pageNum: 1, sOwnerId:this.$global.sellerId}).then(res=>{
					if(res.status==200){
						if(res.data.list.length>0){
							this.noMsg = false;
							res.data.list.forEach(item=>{
								this.goodsTypeArr.push(item)
							})
							console.log(this.goodsTypeArr)
						}else{
							this.noMsg = true;
						}
					}else{
						this.$toast(res.msg)
					}
				}).catch(err=>{
					console.log(err)
				})
			},
					 
			//进入商品分类添加
			addType(e){
				this.$router.push({path:"/manageTypeEdit",query:{saveType:"添加"}})
			},
			
			//进入商品分类编辑
			editType(e){
				let typeName = "";
				let typeSort = "";
				let typeDes = "";
				let typeCId = "";
				let gKindId = "";
				
				this.goodsTypeArr.forEach(item=>{
					if(item.gKindId==e){
						typeName = item.gKindName;
						typeSort = item.gKindSort;
						typeDes = item.gKindRemark;
						gKindId =  item.gKindId;
					}
				})
				this.$router.push({path:"/manageTypeEdit",query:{saveType:"修改",typeId:e,typeName:typeName,typeSort:typeSort,typeDes:typeDes,typeCId:typeCId,gKindId:gKindId}})
			}
			
		 
		  
		},
			 
		created(){						
			this.getGoodsKinds("获取商品类别")
			
			// if(!isLogin()){
			// 	this.$router.push({'path':'/login'})
			// }
		
		}
	}
</script>
<style type="text/css" scoped>
	/deep/ .van-nav-bar{background: #F4BE42;}
	/deep/ .van-nav-bar .van-icon{color: #333333;}
	/deep/ .van-nav-bar .van-nav-bar__text{color: #333333;}
	/deep/ .van-nav-bar__left, .van-nav-bar__right{padding: 0px 7px;}
		
	.no-msg{text-align: center;margin-top: 10px;}	
	.typeChoosePopup {position: relative;}
	.typeChoosePopup .popup-main{background: white;}
	.typeChoosePopup .van-cell__value span{color:#F4BE42}
	.type-choose-foot-empty{height: 43px;background:#F9F9F9}
	.type-choose-foot{background: #F4BE42;color:#333333;text-align: center;height: 43px;line-height: 43px;position: fixed;bottom: 0;left: 0;right: 0;}
	.type-choose-foot span{font-size: 15px;}
	.type-choose-foot span:first-of-type{margin-right: 5px;font-size: 22px;vertical-align: -2px;}
	
</style>