<template>
	<div class="index" style="height: 100%;">
		<!-- 顶部导航 -->
		<van-nav-bar title="门店运营" left-text="商品管理" fixed placeholder right-text="" left-arrow @click-left="navTopBack" />	
		<div class="goodsManagePopup" style="height:calc(100% - 83px);">
			<!-- 上部切换 -->
			<div class="top-nav-empty">
				<div class="top-nav">
					<div class="tab-left-title" @click="leftTabSwitch(0,$event)" :class="{tabWhite:leftTabIndex==0}">全部</div>
					<div class="list-tab">
						<p :class="{footColor:listTabIndex==0}" @click="sellOnShow"><span>售卖中</span><span>{{sellOnNum}}</span></p>
						<p :class="{footColor:listTabIndex==1,showDom:!goodsSort}" @click="sellOutShow"><span>已下架</span><span>{{sellOutNum}}</span></p>
						<p class="list-tab-sort" :class="{showDom:goodsSort}" @click="goodsSortConfirm">确定排序</p>
					</div>
				</div>
			</div>	
			<!-- 下部内容框 -->
			<div class="contents" style="height: calc(100% - 40px);">
				<!-- 左侧切换tab -->
					<div class="left-scroll" style="width:25%;" ref="leftScroll">
						<ul class="tab-left" style="height: calc(100% - 0px);">
							<li v-for="(item,index) in goodsSellArr" :class="{tabWhite:leftTabIndex==(index*1+1)}" :key="index*1+1" @click="leftTabSwitch(index*1+1,$event)" :data-typeId = "item.gKindId">{{item.gKindName}}</li>							
						</ul>
					</div>										
					<myBScroll class="goods-list" style="height: calc(100% - 0px);" ref="rightScroll"  :listenScroll=listenScroll :probeType = 'probeType' @scroll=scroll>
						<!-- 商品列表 -->
						<div class="sell-list">
							<div class="list-item" :id="'listItem'+index" v-for="(item,index) in goodsSellArr" :key="index" >							
								<div class="list-title" :id="'listTitle'+item.gKindId">
									<p>{{item.gKindName}}</p>
									<p v-show="!goodsSort" @click="patchBtn(index)">{{gOperatePatchBtn}}</p>
								</div>
								<ul class="list-goods">								
									<li v-for="(itemSellOn,indexSellOn) in item.goodsArr" :key="indexSellOn">
										<div class="list-goods-msg clearfix">
											<div class="goods-msg-left">
												<van-checkbox v-model="item.goodsArr[indexSellOn].checked" @click="checkboxChange(index,indexSellOn)" checked-color="#F4BE42"></van-checkbox>
												<img :src="itemSellOn.gPic==''?goodsDefaultImg:port+itemSellOn.gPic" alt="">
											</div>												
											<div class="goods-msg-right">
												<p class="good-name">{{itemSellOn.gName}}</p>
												<p class="good-account"><span>销量</span><span>{{itemSellOn.gSellCounter}}</span></p>
												<p class="good-fee">￥<span>{{itemSellOn.gPrice}}</span></p>	
												<p v-show="goodsSort" class="good-sort">
													<input class="good-sort-input" type="number" :value="itemSellOn.gSort" :data-gId = "itemSellOn.gId" @change="sortChange(index,indexSellOn,$event)" >		
												</p>															
											</div>
										</div>
										<div class="list-goods-btns" :class="{showDom:!goodsSort}">
											<van-button plain color="#D2D2D2" type="primary" size="small" @click="sellOnEdit(index,indexSellOn)">编辑</van-button>
											<van-button plain color="#D2D2D2" type="primary" size="small" @click="sellOnDown(itemSellOn.gId)">{{gOperateBtn}}</van-button>
										</div>
									</li>									
							  </ul>
							</div>                
						</div>						
					</myBScroll>
					
				</div>  
			</div>
			 
	    <!-- 底部切换 -->
	    <div class="goodsManagePopup-foot-empty">
			<div class="goodsManagePopup-foot">
				<div class="foot-item" @click="toManageType">
					<span class="iconfont icon-icon-test"></span><span>管理分类</span>
				</div>
				<div class="foot-item" @click="toGoodBuild('添加')">
					<span class="iconfont icon-add-fill"></span><span>新建商品</span>
				</div>
				<div class="foot-item" @click="toGoodsSort" :class={footColor:goodsSort}>
					<span class="iconfont icon-paixu"></span><span>商品排序</span>
				</div>
				<div class="foot-item" @click="toGoodsApprove">
					<span class="iconfont icon-shenpi"></span><span>商品审批</span>
				</div>
			</div>        		
		</div>									  				
	</div>			
</template>

<script type="text/javascript">	
	import Bscroll from 'better-scroll';
	import goodsDefault from "../../assets/image/goods_default.png";//引入默认商品图	
	export default{
		name:"goodsManage",
		data:function(){
			return{						
				goodsManageShow:false,//展示商品管理弹窗
				goodsType:false,//展示管理分类
				goodsNew:false,//展示新建商品								
									
				port:'http://192.168.1.252:9001',//链接
				goodsDefaultImg:goodsDefault,//默认商品图
				leftTabIndex:0,//左侧tab编号	
				listTabIndex:0,//右侧切换编号		
				gOnlineState:1,//商家状态 1-上架；0-下架	
				sellOnNum:0,//售卖中商品数量
				sellOutNum:0,//已下架商品数量
				gOperatePatchBtn:"批量下架",//商品列表批量操作按钮		
				gOperateBtn:"下架",//商品操作按钮
			    gKindId:"",//商品类别id
				goodsTypeArr:[],//类别数据
				goodsSellArr:[],//售卖中数据
				selectResult: [],//批量选中数据
							
				leftTabClick:false,//左侧tab被点击
				goodsSort:false,//展示商品排序
				
				rightItemHeight:[],//右侧滚动列表各item距离顶部距离数组
				currentIndex: 0,
			    offset: 0,
			    scrolly: -1


			};
		},
		
		mounted () {
		    window.addEventListener('scroll', this.scrollTop)
		},
		
		methods:{
					
			//返回键
			navTopBack(){
				this.$router.push({path:"/shopOperation"})
			},	
				
			//进入管理分类页面
			toManageType(){
				this.$router.push({path:"/manageType"})
			},
			
			//进入商品审批页面
			toGoodsApprove(){
				this.$router.push({path:"/goodsApprove"})
			},
			
			//跳转到新建商品页面
			toGoodBuild(e){
				this.$router.push({path:"/goodBuild",query:{saveType:e,fromBtn:"新建商品"}})
			},
			
			//商品排序
			toGoodsSort(){
				this.goodsSort = !this.goodsSort;	
			},
			
			//多选框选择
			checkboxChange(e1,e2){	
				this.goodsSellArr[e1].goodsArr[e2].checked=this.goodsSellArr[e1].goodsArr[e2].checked;				
			},
			
			//上架/下架
			sellOnDown(e){
				let ids = [e];
				let url = "";
				let alertText = "";
				let alertTitle = ""
				if(this.gOperatePatchBtn=="批量下架"){					
					url = "goodsDown";
					alertText = "下架成功";
					alertTitle = "确定下架？"
				}else{
					url = "goodsUp";
					alertText = "上架成功";
					alertTitle = "确定上架？"
				}
				this.$dialog.confirm({
				  title: alertTitle,
				}).then(() => {
					this.$toast.loading({
						message: '提交中...',
						duration: 0,
						forbidClick: true,
						loadingType: 'spinner',
					});					
				    this.$postArr(url,{gIds:ids}).then(res=>{
				    	if(res.status==200){
				    		this.$toast(alertText);
				    		this.getSellList();
				    		this.getGoodsNum()//查找售卖中和已下架商品数量
				    	}
						this.$toast.clear()
				    }).catch(err=>{
				    	console.log(err)						
				    })	
				}).catch(() => {
				    // on cancel
				});			
			},
				
			//上架/下架 批量操作
			patchBtn(e){				
				let ids = [];
				let url = "";
				let alertText = ""	
				let alertTitle = ""
				this.goodsSellArr[e].goodsArr.forEach(item=>{
					if(item.checked){
						ids.push(item.gId)
					}
				})
				if(ids.length==0){
					this.$toast("请勾选商品");
					return
				}
				
				if(this.gOperatePatchBtn=="批量下架"){					
					url = "goodsDown";
					alertText = "下架成功";
					alertTitle = "确定批量下架？"
				}else{
					url = "goodsUp";
					alertText = "上架成功";
					alertTitle = "确定批量上架？"
				}
				this.$dialog.confirm({
					title: alertTitle,
				}).then(() => {
					this.$toast.loading({
						message: '提交中...',
						duration: 0,
						forbidClick: true,						
						loadingType: 'spinner',
					});			
				    this.$postArr(url,{gIds:ids}).then(res=>{
				    	if(res.status==200){
				    		this.$toast(alertText);
				    		this.getSellList();
				    		this.getGoodsNum()//查找售卖中和已下架商品数量
				    	}						
				    }).catch(err=>{
				    	console.log(err)						
				    })	
				}).catch(() => {
				    // on cancel
				});			
			},
						
			//商品排序确定
			goodsSortConfirm(){	
				let sortModels = [];
				this.goodsSellArr.forEach(item=>{
					if(item.goodsArr.length>0){
						item.goodsArr.forEach(item2=>{
							sortModels.push(item2.gId+"|"+item2.gSortNew)
						})
					}
				})			
				this.$toast.loading({
					message: '提交中...',
					duration: 0,
					forbidClick: true,
					loadingType: 'spinner',
				});			
				this.$postArr("goodsSort",{sortModels:sortModels}).then(res=>{
					if(res.status ==200){
						this.$toast("排序成功");
						this.getSellList();
					}					
				}).catch(err=>{
					console.log(err)
				})	
			},		
			
			//排序框变化时
			sortChange(e1,e2,e3){
				this.goodsSellArr[e1].goodsArr[e2].gSortNew = e3.target.value;			
			},
			
			//左侧tab切换事件
			leftTabSwitch(e,event){				
				this.leftTabIndex = e;		
				let typeid = event.target.dataset.typeid;									
				let listItemDom = document.getElementsByClassName("list-item");//右侧滚动列表单个list	
				if(!typeid){//如果点击全部，则让第一个分类置顶
					listItemDom[0].scrollIntoView({behavior: "smooth", inline: "nearest"});
					return
				}	
				for(var i = 0 ;i<listItemDom.length;i++){													
					var listItemDomChildren = listItemDom[i].childNodes;
					for(var a = 0;a<listItemDomChildren.length;a++){
						if(listItemDomChildren[a].getAttribute("id")==`listTitle${typeid}`){						
							listItemDomChildren[a].parentNode.scrollIntoView({behavior: "smooth", inline: "nearest"});
						}
					}
				}														
			},
			
			//右侧列表滚动时触发
			scroll(position){
				// let goodsListDom = document.getElementsByClassName("goods-list")
				// let listItemDom = document.getElementsByClassName("list-item");//右侧滚动列表单个list			
				// for(var i = 0 ;i<listItemDom.length;i++){										
				// 	//console.log(listItemDom[i].getBoundingClientRect().top)
				// 	if(listItemDom[i].getBoundingClientRect().top==86){//该item到顶了
				// 		console.log("该item到顶了",listItemDom[i])
				// 	}
				// }	
				// console.log(listItemDom[1].getBoundingClientRect().top)
				
				this.scrolly = position.y
			},
				
			//各item高度数组			
			heightArr () {			
				let listItemDom = document.getElementsByClassName("list-item");//右侧滚动列表单个list	
				let list = this.$refs.item				
				for(var i = 0 ;i<listItemDom.length;i++){					
					this.rightItemHeight.push(listItemDom[i].getBoundingClientRect().top)					
				}	
				console.log("各item高度数组:",this.rightItemHeight) 
			},
			
			selectMenu (index) {
			    let height = 0
			    this.currentIndex = index
		 
			    for (let i = 0; i < index; i++) {
				    height += this.$refs.item[i].offsetHeight
			    }
		 
				let foodsEle = this.$refs.foodsUl.getElementsByClassName('item')[index]
				this.$refs.foodsWrapper.scrollToElement(foodsEle, 400)
				// this.$refs.foodsWrapper.scrollTo(0, -height)
				this.offset = height
			},
			
			//查找售卖中和已下架商品数量
			getGoodsNum(){
				//请求售卖中数量
				let sellOnListData = {
					sOwnerId :this.$global.sellerId,
					gKindId : "",
					gOnlineState : 1,//上架状态0下架1上架
					gAuditState : 1 , //审核状态0审核中1已审核2已驳回
					keyword : "",
					pageNum : 1 ,
					pageSize :100000
				}				
				this.$get("getGoodsList",sellOnListData).then(res=>{	
					console.log("上架",res)
					if(res.status==200){	
						this.sellOnNum = res.data.total;
					}							
				}).catch(err=>{
					console.log(err)
				})
				//请求已下架数量
				let sellOutListData = {
					sOwnerId :this.$global.sellerId,
					gKindId : "",
					gOnlineState : 0,//上架状态0下架1上架
					gAuditState : 1 , //审核状态0审核中1已审核2已驳回
					keyword : "",
					pageNum : 1 ,
					pageSize :100000
				}							
				this.$get("getGoodsList",sellOutListData).then(res=>{						
					if(res.status==200){	
						this.sellOutNum = res.data.total;
					}							
				}).catch(err=>{
					console.log(err)
				})					
			},
	
			//查找商品数据
			getSellList(){
				this.goodsSellArr.splice(0,this.goodsSellArr.length);
				let goodsTypeData = {
				 sOwnerId :this.$global.sellerId,
				 keyword:"",
				 pageNum:"1",
				 pageSize :"1000000"
				 }
				this.$get("getGoodsKinds",goodsTypeData).then(res=>{
				    if(res.status==200&&res.data.list.length>0){									
						res.data.list.forEach(item => {	
							let typeData = {
								gKindId:item.gKindId,
								gKindName:item.gKindName,
								gKindRemark:item.gKindRemark,
								gKindSort:item.gKindSort,
								}							
							this.goodsTypeArr.push(typeData)																	
						})										
						for(let i = 0;i<this.goodsTypeArr.length;i++){
							//遍历类型，查找该类型下的售卖中商品
							let sellOnListData = {
								sOwnerId :this.$global.sellerId,
								gKindId : this.goodsTypeArr[i].gKindId,
								gOnlineState : this.gOnlineState,//上架状态0下架1上架
								gAuditState : 1 , //审核状态0审核中1已审核2已驳回
								keyword : "",
								pageNum : 1 ,
								pageSize :100000
							}								
							this.$get("getGoodsList",sellOnListData).then(resGoods=>{								
								if(resGoods.status==200){				
									let itemGoodsArr=[];
									let itemSortArr=[];											
									resGoods.data.list.forEach(itemGoods=>{	
										itemGoods.checked = false;
										itemGoods.gSortNew = itemGoods.gSort;
										itemGoodsArr.push(itemGoods);													
									})											
									this.$set(this.goodsTypeArr[i],"goodsArr",itemGoodsArr)									
								}									
							}).catch(errGoods=>{
								console.log(errGoods)
							})													
						}		
						this.goodsSellArr = this.goodsTypeArr						
						console.log("商品数据",this.goodsSellArr)
						setTimeout(function(){
							this.scroll = new Bscroll(this.$refs.rightScroll, {})
						}, 30);
						
				 }
			 }).catch(err=>{
				 console.log(err)
			 })						
			 // //初始化better-scroll
			 // this.$nextTick(() => {
			 // 	this.scroll = new Bscroll(this.$refs.rightScroll, {})
			 // })
			} ,

			//展示售卖中popup
			sellOnShow(){
				this.listTabIndex=0;
				this.goodsSellOn = true;
				this.gOnlineState = 1;
				this.gOperateBtn = "下架";
				this.gOperatePatchBtn = "批量下架";
				this.getSellList();//请求商品数据
			},

			//展示已下架中popup
			sellOutShow(){
				this.listTabIndex=1;
				this.goodsSellOut = true;
				this.gOnlineState = 0;
				this.gOperateBtn = "上架";
				this.gOperatePatchBtn = "批量上架";
				this.getSellList();//请求售卖中数据
			},
			
			//售卖中编辑
			sellOnEdit(e1,e2){
				this.$router.push({path:"/goodBuild",query:{goodsData:this.goodsSellArr[e1].goodsArr[e2],fromBtn:"商品管理编辑"}})
			},
					  
		},
			
		watch: {
		    scrolly (newy) {
		      if (newy >= 0) this.currentIndex = 0
		      let itemHeight = this.rightItemHeight
		      for (let i = 0; i < rightItemHeight.length - 1; i++) {
		        let h1 = itemHeight[i]
		        let h2 = itemHeight[i + 1]
		        if (-newy >= h1 && -newy < h2) {
		          this.currentIndex = i
		          return
		        }
		      }
		    }
		 
		},
	 
		created(){						
			let yearNow = new Date().getFullYear();
			let monthNow = new Date().getMonth() + 1;				
			this.currentDate =  yearNow + '年' + monthNow + '月';
			
			this.getSellList();//查找商品数据
			this.getGoodsNum();//查找售卖中和已下架商品数量
							
			this.listenScroll = true
			this.probeType = 3
			this.rightItemHeight = [0]
		},
		
		mounted() { 		
			// this.$nextTick(() => { 
			// 	this.scroll = new Bscroll(this.$refs.rightScroll, {}) 
			// }) 
			
			this.$nextTick(() => {
				this.heightArr()
			}, 20);

		} 

	}
</script>
<style type="text/css" scoped>
	/deep/ .van-nav-bar{background: #F4BE42;}
	/deep/ .van-nav-bar .van-icon{color: #333333;}
	/deep/ .van-nav-bar .van-nav-bar__text{color: #333333;}
	/deep/ .van-nav-bar__left, .van-nav-bar__right{padding: 0px 7px;}
		
	.goodsManagePopup .popup-main{background: white!important;}
	.goodsManagePopup-foot-empty{height: 37px;}
	.goodsManagePopup-foot{display: flex;flex-wrap: wrap;position: fixed;bottom: 0;right: 0;left: 0;font-size: 13px;background: white;}
	.foot-item{flex:1;text-align: center;border-right: 1px solid #E9E9E9;box-sizing: border-box;padding: 10px 0;}
	.foot-item:last-of-type{border-right: 0;}
	.foot-item span:first-of-type{margin-right: 3px;}
	.footColor{color:#F4BE42;}
	
	.top-nav-empty{height: 40px;}
	.top-nav{display: flex;background: white;position: fixed;left: 0;right: 0;top: 46px;z-index: 10;}
	.contents{display: flex;}
	.tab-left-title {width:25%;display: flex;align-items: center;justify-content: center;background: #F8F8F8;}
	.top-nav .list-tab{width:75%;}
	
	.tab-left{background: #F8F8F8;width: 100%;box-sizing: border-box;overflow: auto;}
	.tab-left-title{font-weight: bold;}
	.tab-left li{height: 40px;line-height: 40px;text-align: center;padding: 0 10px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}
	.goods-list{width: 75%;box-sizing: border-box;overflow: auto;background-color: white;}
	.tabWhite{background:white;}
  .list-tab{display: flex;border-bottom:1px solid #F7F7F7;position: relative;}
	.list-tab p{width:50%;text-align: center;box-sizing: border-box;height: 40px;line-height: 40px;}
	.showDom{display: block!important;}
	.list-title{display: flex;justify-content: space-between;padding: 8px 15px 8px 5px;}
	.list-title p:first-of-type{font-size: 15px;font-weight: bold;}
	.list-title p:last-of-type{font-size: 15px;color: #F4BE42;}
	.list-item{border-bottom: 1px solid #F7F7F7;}
	.list-goods li:not(:last-of-type){border-bottom: 1px solid #F7F7F7;padding-bottom: 10px;}
	.list-goods li{padding-bottom: 10px;}
	.list-goods-msg{padding: 10px;}
	.goods-msg-left{margin-right: 10px;display: flex;align-items: center;justify-content: space-between;float: left;}
	.goods-msg-left img{width:75px;height: 75px;display: inline-block;margin-left: 10px;}	
	.good-name{font-size: 15px;color: #F4BE42;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}
	.good-account{font-size: 13px;color:#333333;margin-top:5px;margin-bottom: 10px;}
	.good-fee{font-size: 15px;color:#EA4646;}
	.list-goods-btns{text-align: right;}
	.list-goods-btns button{margin-right: 15px;border-radius: 5px;}
	.list-goods-btns	.van-button--small {min-width: 65px;}
	.goodsManagePopup	.list-goods-btns button span{color: #333333;}


	.good-sort{position: absolute;right: 0;bottom: 0;width: 32px;height: 30px;text-align: center;line-height: 30px;border: 1px solid #F4BE42;color:#F4BE42;border-radius: 5px;}
	.goods-msg-right{position: relative;margin-left: 105px;}
	.goodsManagePopup .list-tab p:not(:first-of-type){display: none;}
	.goodsManagePopup .list-goods-btns{display: none;}
	.good-sort input{border-radius: 5px;text-align: center;border: 0;outline: none;width: 100%;}
	.list-tab-sort{position: absolute;width: 25%!important;height:25px!important;line-height:24px!important;border:1px solid #F4BE42;color:#F4BE42;border-radius: 5px;text-align: center;top: 7px;right: 12px}

	.goods-list{
	transition-property: all;
	transition-duration: .5s;
	transition-timing-function: cubic-bezier(0, 1, 0.5, 1);
	}
</style>