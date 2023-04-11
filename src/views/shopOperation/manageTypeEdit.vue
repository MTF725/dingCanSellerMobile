<template>
	<!-- 商品分类编辑弹窗 -->
	<div class="typeEditPopup"  style="height: calc(100% - 40px);">
		<!-- 顶部导航 -->
		<van-nav-bar :title="saveType=='添加'?'添加分类':'编辑分类'" left-text="管理分类" fixed placeholder right-text="保存" left-arrow @click-left="navTopBack" @click-right="typeEditSave"/>	
		<!-- popup内容区 -->
		<div class="popup-main">
			<p class="typeEditTitle">分类名</p>
			<div class="type-msg-box">
				<van-field v-model.trim="gTypeEditName" autosize maxlength="20" placeholder="请输入分类名称(20字以内)"/>
			</div>
			<p class="typeEditTitle">分类排序</p>
			<div class="type-msg-box">
				<van-field v-model.trim="gTypeEditSort" type="number" placeholder="请输入分类排序"/>
			</div>														
			<p class="typeEditTitle">分类描述</p>
			<div class="type-msg-box">
					<van-field v-model.trim="gTypeEditDes" autosize  maxlength="50" show-word-limit type="textarea" placeholder="请输入描述(50字以内)" size="large"/>	
			</div>
			<div class="btn-box" v-show="saveType=='添加'?false:true">
				<van-button @click="goodsTypeDel" type="primary" size="large">删除分类</van-button>
			</div>												
		</div>	
	</div> 
</template>

<script type="text/javascript">
	import QS from 'qs'; // 引入qs模块
	export default{
		name:"manageTypeEdit",
		data:function(){
			return{			
				gTypeEditName:"",//分类名
				gTypeEditSort:"",//分类排序
				gTypeEditDes:"",//分类描述
				gTypeEditKindId:"",//分类id
				navRightText:"保存",//导航右侧按钮
				showDelBtn:false,//显示删除分类按钮
				saveType:"添加",//保存类型  添加-修改
			};
		},
		mounted() {
			 //滚动到底加载更多
			  window.addEventListener('scroll',this.reachBottom)			  
		},
		//销毁监听滚动条事件
		destroyed(){
			
		},
		computed:{
			
		},
		
		methods:{
			//返回键
			navTopBack(){
				this.$router.go(-1)
			},	
		 			
			//商品分类编辑保存
			typeEditSave(){
				if(this.saveType=="添加"){
					this.addGoodsType()
				}else{
					this.editGoodsType()
				}
			},
			
			//添加商品类型
			addGoodsType(){			
				if(this.gTypeEditName==""){
					this.$toast("请输入分类名称");
					return;
				}
				if(this.gTypeEditSort==""){
					this.$toast("请输入分类排序");
					return;
				}				
				if(!this.$global.zzsReg.test(this.gTypeEditSort)){
					this.$toast("分类排序必须是正整数");
					return;
				}			
				let data = {
					gKindName :this.gTypeEditName ,
					gKindSort:this.gTypeEditSort,
					gKindRemark:this.gTypeEditDes ,
					sOwnerId : this.$global.sellerId ,
					cId :this.$global.cId ,
				}
				this.$toast.loading({
					message: '提交中...',
					duration: 0,
					forbidClick: true,
					loadingType: 'spinner',
				});		
				this.$post("addGoodsType",data).then(res=>{
					console.log("商品分类编辑",res)
					if(res.status==200){
						this.$router.push({path:"/manageType"})
						this.$toast("保存成功");	
						
					}					
				}).catch(err=>{
					conosle.log(err)
				})
			},
			
			//修改商品类型
			editGoodsType(){			
				if(this.gTypeEditName==""){
					this.$toast("请输入分类名称");
					return;
				}
				if(this.gTypeEditSort==""){
					this.$toast("请输入分类排序");
					return;
				}
				
				if(!this.$global.zzsReg.test(this.gTypeEditSort)){
					this.$toast("分类排序必须是正整数");
					return;
				}
				
				let data = {
					gKindName :this.gTypeEditName ,
					gKindSort:this.gTypeEditSort,
					gKindRemark:this.gTypeEditDes ,
					gKindId : this.gKindId,
					sellerId :this.$global.sellerId ,
				}		
				this.$toast.loading({
					message: '提交中...',
					duration: 0,
					forbidClick: true,
					loadingType: 'spinner',
				});		
				this.$put("editGoodsType",data).then(res=>{
					console.log("商品分类编辑",res)
					if(res.status==200){
						this.$router.push({path:"/manageType"})
						this.$toast("保存成功");					
					}					
				}).catch(err=>{
					conosle.log(err)
				})
			},

			//商品分类删除
		    goodsTypeDel(){
				let ids = [];
				ids.push(this.gTypeEditKindId)		
				this.$dialog.confirm({
					title: "确定删除分类？",
				}).then(() => {
					this.$toast.loading({
						message: '提交中...',
						duration: 0,
						forbidClick: true,
						loadingType: 'spinner',
					});	
				    this.$delArr("delGoodsType",{gKindIds:ids}).then(res=>{				    	
				    	if(res.status==200){						  
				    		  this.$toast("删除分类成功");
				    		  this.$router.push({path:"/manageType"})
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
			this.saveType = this.$route.query.saveType;
			this.gKindId = this.$route.query.typeId;
			if(this.gKindId){			
				this.gTypeEditName = this.$route.query.typeName ;
				this.gTypeEditSort = this.$route.query.typeSort;
				this.gTypeEditDes = this.$route.query.typeDes;
				this.gTypeEditKindId = this.$route.query.gKindId;
				
			}
			
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
		
	.typeEditPopup .popup-main {padding: 0 16px;background: white;height: 100%;}
	.typeEditTitle{padding: 10px 0 6px 0;}
	.type-msg-box{border:1px solid #DDDDDD;border-radius: 5px;}
	.type-msg-box .van-field{padding: 5px 8px;border-radius: 5px;} 
	.btn-box{text-align: center;margin-top: 40px;margin-bottom: 15px;}
	.btn-box .van-button--large {width: 100%;height: 45px;line-height:45px;border-radius: 5px;}
	.btn-box .van-button--primary{background:#F26666 ;border-color:#F26666;}
	.btn-box .van-button--primary span{color:white;font-size: 16px;}


	
</style>