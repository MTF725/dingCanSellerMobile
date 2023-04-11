<template>	
	<!-- 商品编辑/添加弹窗 -->

	<div class="goodsEditPopup">
		<!-- 顶部导航 -->
		<van-nav-bar :title="pageTitle" left-text="商品管理"  fixed placeholder :right-text="headerSaveBtn" left-arrow  @click-left="navTopBack" @click-right="goodsSave"/>	
		<!-- popup内容区 -->		
		<div class="popup-main" style="height: calc(100% - 40px);">
			<van-cell-group>
				<van-field v-model.trim="gName"  label="商品名称" input-align="right" :readonly="inputReadonly">
					<template #left-icon>
						<span>*</span>					
					</template>
				</van-field>
				<van-cell center title="商品分类" :value="gType" @click="toManageType" :readonly="inputReadonly" is-link>	
					<template #icon>
						<span class="star-icon">*</span>					
					</template>																	
				</van-cell>
				<van-field v-model.trim="gNo" label="商品编号" input-align="right" :readonly="inputReadonly">
					<template #left-icon>
						<span>*</span>					
					</template>
				</van-field>
				<van-field v-model.trim="gSort" label="商品排序" input-align="right" type="number" :readonly="inputReadonly">
					<template #left-icon>
						<span>*</span>					
					</template>
				</van-field>	
				<van-cell center title="上传图片" >
					<template #icon>
						<span class="star-icon start-hidden">*</span>					
					</template>																				
					<template #default>
						<van-uploader :after-read="getGoodsPicUrl" :disabled ="inputReadonly">
							<img class="right-img" :src="gPic==''?goodsDefaultImg:gPic=='img/camera.5d55eeed.png'?gPic:port+gPic" alt="">
						</van-uploader>							
					</template>
				</van-cell>
				<van-field v-model.trim="gTag" label="商品标签" input-align="right" :readonly="inputReadonly">
					<template #left-icon>
						<span class="start-hidden">*</span>					
					</template>
				</van-field>	
				<van-field v-model.trim="gDescribe" label="商品描述" input-align="right" :readonly="inputReadonly">
				<template #left-icon>
						<span class="start-hidden">*</span>					
					</template>
				</van-field>	
				<van-field v-model.trim="gPrice" label="价格" input-align="right" type="number" :readonly="inputReadonly">
					<template #left-icon>
						<span>*</span>					
					</template>
				</van-field>										 
				<van-field v-model.trim="gGreenFee"  label="环保费" input-align="right" type="number" :readonly="inputReadonly">
					<template #left-icon>
						<span>*</span>					
					</template>
				</van-field>	  
				<van-field v-model.trim="gProperties" label="商品属性" input-align="right" :readonly="inputReadonly">
					<template #left-icon>
						<span  class="start-hidden">*</span>					
					</template>
				</van-field>		
				<van-field v-model.trim="gUnit" label="商品单位" input-align="right" :readonly="inputReadonly">
					<template #left-icon>
						<span  class="start-hidden">*</span>					
					</template>																				
				</van-field>				
				<van-field v-model.trim="gSellMin" label="最小购买数量" input-align="right" type="number" :readonly="inputReadonly">
					<template #left-icon>
						<span>*</span>					
					</template>									
				</van-field>																		
				<van-cell center>		
					<template #icon>
						<div class="recommend-checkbox" >
							<van-checkbox v-model="gRecommend" checked-color="#F4BE42" :disabled="inputReadonly" icon-size="16px">设为推荐商品</van-checkbox>			
						</div>
					</template>																
				</van-cell>
			</van-cell-group>
		</div>		
	</div>  
		
</template>

<script type="text/javascript">
	
	import goodsDefault from "../../assets/image/goods_default.png";//引入默认商品图
	import addPicImg from "../../assets/image/camera.png";//引入添加图片
	
	export default{
		name:"goodBuild",
		data:function(){
			return{		
				pageTitle:"",
				goodsDesShow:false,//商品详情弹窗
				port:'http://192.168.1.252:9001',//链接
				goodsDefaultImg:goodsDefault,//默认商品图			
						
			    gKindId:"",//商品类别id			
				gId:"",//商品id
				gName:"",//商品名称
				gType:"",//商品类别
				gNo:"",//商品编号
				gPic:"",//图片
				gSort:"",//商品排序
				gTag:"",//商品标签
				gDescribe:"",//商品描述
				gPrice:"",//商品价格		
				gGreenFee:"",//环保费
				gProperties:"",//商品属性
				gUnit:"",//商品单位
				gSellMin:"",//最小购买数量
				gRecommend:false,//设为推荐商品
				goodsSaveType:"",//商品保存类型（添加-修改）	
				
				gOnlineState: "", //上架状态0下架1上架
				gAuditState: "", //审核状态0待审核1已审核2已驳回
				fromBtn:"",//返回的页面
				headerSaveBtn:"保存",//导航按钮文字
				inputReadonly:false,//页面只读
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
				if(this.fromBtn =="商品审批详情"||this.fromBtn =="商品审批整改"){
					this.$router.go(-1)					
				}else{
					this.$router.push({path:"/goodsManage"})
				}
				
			},	
			
			//进入管理分类页面
			toManageType(){
				if(!this.inputReadonly){
					this.$router.push({path:"/manageType",query:{fromPage:"goodBuild"}})
				}			
			},
			
			//商品修改确定
			goodsSave(){
				//商品添加/编辑必填校验
				if(!this.goodsDataRequired()){
					return
				}								
				if(this.goodsSaveType=="添加"){	
					console.log("添加")
					this.addGoods();//添加商品
				}else{	
					console.log("修改")
					this.editGoods();//修改商品					
				}
			},
			
			//添加商品
			addGoods(){
				let data = {
					gNo: this.gNo,
					gName :this.gName,
					gKindId :this.gKindId,
					gSort : this.gSort,
					gTag :this.gTag,
					gPic :this.gPic,
					gDescribe:this.gDescribe,
					gPrice :this.gPrice ,
					gGreenFee :this.gGreenFee ,
					gProperties :this.gProperties,
					gUnit :this.gUnit ,
					gSellMin :this.gSellMin ,
					gRecommend :this.gRecommend?1:0,
					gOnlineState :this.gOnlineState,//上架状态0下架1上架
					gAuditState :this.gAuditState,//审核状态0待审核1已审核2已驳回
					sOwnerId:this.$global.sellerId,//商家id
					cId:this.$global.cId,//学校id
				}
				this.$toast.loading({
					message: '提交中...',
					duration: 0,
					forbidClick: true,
					loadingType: 'spinner',
				});
				this.$post("goodsAdd",data).then(res=>{							
					if(res.status == 200){
						this.$toast("保存成功");						
						//清空数据
						this.gNo = "";
						this.gName = "";
						this.gKindId = "";
						this.gSort = "";
						this.gTag = "";
						this.gPic = "";
						this.gDescribe = "";
						this.gPrice = "";
						this.gGreenFee = "";
						this.gProperties = "";
						this.gUnit = "";
						this.gSellMin = "";							
						this.gRecommend = "";
						this.gOnlineState = "";
						this.gAuditState = "" ;
						this.gType = "";
					}
					this.$toast.clear()
				 }).catch(err=>{
					 console.log(err)					
				 })   
			},
			
			//修改商品
			editGoods(){
				let data = {
					gId:this.gId,
					gNo: this.gNo,
					gName :this.gName,
					gKindId :this.gKindId,
					gSort : this.gSort,
					gTag :this.gTag,
					gPic :this.gPic,
					gDescribe:this.gDescribe,
					gPrice :this.gPrice ,
					gGreenFee :this.gGreenFee ,
					gProperties :this.gProperties,
					gUnit :this.gUnit ,
					gSellMin :this.gSellMin ,
					gRecommend :this.gRecommend?1:0,
					gOnlineState :this.gOnlineState,//上架状态0下架1上架
					gAuditState :this.gAuditState,//审核状态0待审核1已审核2已驳回
					sOwnerId:this.$global.sellerId,//商家id
					cId:this.$global.cId,//学校id
				}
				this.$toast.loading({
					message: '提交中...',
					duration: 0,
					forbidClick: true,
					loadingType: 'spinner',
				});
				this.$put("goodsEdit",data).then(res=>{					
					 if(res.status == 200){
						this.$toast("保存成功")
						this.$router.push({path:"/goodsManage"})						
					 }
					 this.$toast.clear()
				 }).catch(err=>{
					 console.log(err)					 
				 })   
			},
									
			//商品添加/编辑必填校验
			goodsDataRequired(){
				console.log(this.gGreenFee)
				if(this.gName ===""){
					 this.$toast("请输入商品名称");
					 return false;
				}
				if(this.gKindId ===""){
					 this.$toast("请输入商品分类");
					 return false;
				}
				if(this.gNo ===""){
					 this.$toast("请输入商品编号");
					 return false;
				}
				if(this.gSort ===""){
					 this.$toast("请输入商品排序");
					 return false;
				}
				//判断商品排序正整数
				if (!(integerReg.test(this.gSort))) {
				   this.$toast('商品排序必须是正整数');
					return false;
				}
				if(this.gPrice ===""){
					 this.$toast("请输入商品价格");
					 return false;
				}
				//判断价格是大于或等于0的数字
				if (!(posReg.test(this.gPrice))) {
					this.$toast('价格必须是大于或等于0的数字');
					return false;
						}
						 //判断价格小数点后最多两位
				if (!(pointTwoReg.test(this.gPrice))) {
					this.$toast('小数点后最多两位');
					return false;
				}    
				if(this.gGreenFee ===""){
					 this.$toast("请输入环保费");
					 return false;
				}
				 //判断环保费是大于或等于0的数字
				if (!(posReg.test(this.gGreenFee))) {
					this.$toast('环保费必须是大于或等于0的数字');
					return false;
				}
				//判断环保费小数点后最多两位
				if (!(pointTwoReg.test(this.gGreenFee))) {
					this.$toast('小数点后最多两位');
					return false;
				}
				if(this.gSellMin ===""){
					 this.$toast("请输入最小购买数量");
					 return false;
				}
				 //判断最小购买数量是非零正整数
				if (!(zzsReg.test(this.gSellMin ))) {
					this.$toast('购买数量必须是非零正整数');
					return false;
				}	
				return true;			
			},
			
			//获取商品图片地址
			getGoodsPicUrl(e){				
				let formData = new FormData();
				formData.append("file",e.file);				
				this.$fromDataPost("getGoodsPicUrl",formData).then(res=>{
					if(res.status==200){
						this.gPic = res.data
					}else{
						this.$toast(res.msg)
					}
					
				}).catch(err=>{
					console.log(err)
				})			
			},
		},
		
		//离开路由时
		beforeRouteLeave(to, from, next) {
			if (to.name !== "manageType") {
				this.$store.commit("noKeepAlive", "goodBuild");
			}
			next();
		},	
		
		activated(){	
			this.fromBtn = this.$route.query.fromBtn;
			this.headerSaveBtn = "保存";	
			this.inputReadonly = false;
			//从goodsManage编辑按钮或审批页面详情进入页面时，携带数据
			if(this.$route.query.goodsData){
				console.log(this.$route.query.goodsData)
				this.gId = this.$route.query.goodsData.gId;
				this.gNo = this.$route.query.goodsData.gNo;
				this.gName = this.$route.query.goodsData.gName;
				this.gKindId = this.$route.query.goodsData.gKindId;
				this.gSort = this.$route.query.goodsData.gSort;
				this.gTag = this.$route.query.goodsData.gTag;
				this.gPic = this.$route.query.goodsData.gPic;			
				this.gDescribe = this.$route.query.goodsData.gDescribe;
				this.gPrice = this.$route.query.goodsData.gPrice;
				this.gGreenFee = this.$route.query.goodsData.gGreenFee;
				this.gProperties = this.$route.query.goodsData.gProperties;
				this.gUnit = this.$route.query.goodsData.gUnit;
				this.gSellMin = this.$route.query.goodsData.gSellMin;
				this.gRecommend = this.$route.query.goodsData.gRecommend;
				this.gSellMin = this.$route.query.goodsData.gSellMin;
				this.gType = this.$route.query.goodsData.gKindName;
				this.pageTitle = "编辑商品";
				this.goodsSaveType = "修改";
				this.gOnlineState= this.$route.query.goodsData.gOnlineState; //上架状态0下架1上架
				this.gAuditState= this.$route.query.goodsData.gAuditState;//审核状态0待审核1已审核2已驳回						
			}else{
				this.pageTitle = "新建商品";
				this.goodsSaveType = "添加";
				this.gOnlineState= 0; //上架状态0下架1上架
				this.gAuditState= 0;//审核状态0待审核1已审核2已驳回
			}
					
			//从审批详情按钮进入时	
			if(this.$route.query.goodsData&&this.fromBtn=="商品审批详情"){
				this.pageTitle = "详情";
				this.headerSaveBtn = "";	
				this.inputReadonly = true;
			}
						
			if(this.$route.query.gType&&this.$route.query.gKindId){
				this.gType = this.$route.query.gType;
				this.gKindId = this.$route.query.gKindId;
			}
		}
		
		
	}
</script>
<style type="text/css" scoped>
	/deep/ .van-nav-bar{background: #F4BE42;}
	/deep/ .van-nav-bar .van-icon{color: #333333;}
	/deep/ .van-nav-bar .van-nav-bar__text{color: #333333;}
	/deep/ .van-nav-bar__left, .van-nav-bar__right{padding: 0px 7px;}
		
	.star-icon{margin-right:5px ;}
	.start-hidden{opacity: 0;}
	.goodsEditPopup .right-img{display: inline-block;width: 56px;height: 56px;}
	.goodsEditPopup .popup-main{background: white;}
	.goodsEditPopup .van-field__right-icon span{color:#333333}
	.goodsEditPopup .van-cell__value span{color:#333333}
	.recommend-checkbox{margin-right: 5px;}
	
	/deep/ .van-checkbox__label--disabled{color:#323233;}
	/deep/ .van-checkbox__icon--disabled .van-icon{background-color:#F4BE42;border-color: #F4BE42;}
	/deep/ .van-checkbox__icon--disabled.van-checkbox__icon--checked .van-icon{color:#fff}
	/deep/ .van-uploader__wrapper--disabled{opacity: 1;}
</style>