<template>
	<!-- 审批中列表 -->
	<div class="box" style="background: #F9F9F9;">
		<div class="goods-deal-title" style="background: white;">
			<p><span @click="patchBtn('批量上架')">批量上架</span><span @click="patchBtn('一键上架')">一键上架</span></p>							
		</div>
		<van-pull-refresh v-model="refreshing" @refresh="onRefresh" style="height:calc(100% - 62px;);">
			<ul class="goods-deal-list" style="background: white;">
				<van-list v-model="loading" :finished="finished" finished-text="没有更多了" offset=1  @load="getOperateList">			
					<li v-for="(item,index) in goodsOperateArr" :key="index">
						<div class="list-goods-msg clearfix">
							<div class="goods-msg-left">
								<van-checkbox v-model="item.checked" :name="1"  checked-color="#F4BE42"  icon-size="20px"></van-checkbox>
								<img :src="item.gPic==''?goodsDefaultImg:port+item.gPic" alt="">
							</div>												
							<div class="goods-msg-right">
								<p class="good-name">{{item.gName}}</p>			
								<div class="list-goods-btns">
									<div class="pass-btns">
										<van-button plain color="#39AD27" type="primary" size="small" @click="sellOnDown(item.gId)">上架</van-button>
										<van-button plain color="#D2D2D2" type="primary" @click="sellOnEdit(index)" size="small">详情</van-button>
									</div>			
								</div>					
								<p class="good-fee">￥<span>{{item.gPrice}}</span></p>														
							</div>
						</div>
					</li>
				</van-list>		
			</ul>
		</van-pull-refresh>		
	</div>   
</template>

<script type="text/javascript">
	
	import goodsDefault from "../../assets/image/goods_default.png";//引入默认商品图
	export default{
		data:function(){
			return{							
				goodsOperateArr:[],//审批，通过，驳回数据		
				port:'http://192.168.1.252:9001',//链接
				goodsDefaultImg:goodsDefault,//默认商品图
				totalNum:0,//记录总数
				pageNum:0,//页码
				loading: false,
				finished: false,
				refreshing: false,
			};
		},
		methods:{		
			//查找审批中商品数据
			getOperateList(){
				if (this.refreshing) {
				  this.goodsOperateArr = [];				
				  this.refreshing = false;
				  this.totalNum=0;//记录总数
				  this.pageNum=0;//页码				 
				}
				this.loading = true;						
				if (this.pageNum>1&&this.goodsOperateArr.length >= this.totalNum) {
					this.finished = true;
					this.loading = false;
					return
				}			
				this.pageNum++;
				let operateListData = {
					sOwnerId :this.$global.sellerId,
					gKindId : "",
					gOnlineState : 0,//上架状态0下架1上架
					gAuditState : 1 , //审核状态0审核中1已审核2已驳回
					keyword : "",
					pageNum : this.pageNum ,
					pageSize :20
				}	
				this.$get("getGoodsList",operateListData).then(res=>{			
					console.log(res)					
					if(res.status==200){	
						this.totalNum =  res.data.total;
						if(res.data.list.length>0){
							res.data.list.forEach(item=>{
								item.checked=false;
								this.goodsOperateArr.push(item)
							})						
						}						
						this.loading = false;
					}								
				}).catch(errGoods=>{
					console.log(errGoods)
				})														
			},  
			
			
			//上架
			sellOnDown(e){				
				let ids = [e];			
				this.$dialog.confirm({
				  title: "确定上架？",
				}).then(() => {
					this.$toast.loading({
						message: '提交中...',
						duration: 0,
						forbidClick: true,
						loadingType: 'spinner',
					});			
				    this.$postArr("goodsUp",{gIds:ids}).then(res=>{
				    	if(res.status==200){
				    		this.$toast("上架成功");
				    		//this.getOperateList();//查找审批中商品数据
							this.clearGetList();//查找审批中商品数据
				    	}
				    }).catch(err=>{
				    	console.log(err)
				    })	
				}).catch(() => {
				    // on cancel
				});			
			},
				
			//上架 批量操作
			patchBtn(e){
				let ids = [];
				let alertTitle = ""
				if(e=="批量上架"){
					this.goodsOperateArr.forEach(item=>{
						if(item.checked){
							ids.push(item.gId)
						}
					})
					if(ids.length==0){
						this.$toast("请勾选商品");
						return
					}
					alertTitle = "确定批量上架？"
				}else if(e=="一键上架"){
					this.goodsOperateArr.forEach(item=>{
						ids.push(item.gId)
					})
					if(ids.length==0){
						this.$toast("暂无商品需要上架");
						return
					}
					alertTitle = "确定一键上架？"
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
				    this.$postArr("goodsUp",{gIds:ids}).then(res=>{
				    	if(res.status==200){
				    		this.$toast("上架成功");
				    		this.clearGetList();//查找审批中商品数据
				    	}
				    }).catch(err=>{
				    	console.log(err)
				    })	
				}).catch(() => {
				    // on cancel
				});			
			},
			
			//下拉刷新
			onRefresh() {
			   // 清空列表数据
			   this.finished = false;
			   this.loading = true;
			   this.getOperateList()
			},
					
			//清空并刷新列表
			clearGetList(){
				this.pageNum= 0;
				this.totalNum= 0;
				this.goodsOperateArr = [];
				this.getOperateList();
			},
					
			
			//查看详情
			sellOnEdit(e){		
			 	this.$router.push({path:"goodBuild",query:{goodsData:this.goodsOperateArr[e],fromBtn:"商品审批详情"}})
			},
			
		},
				 
		created(){						
			this.getOperateList();//查找审批中商品数据			
		}
	}
</script>
<style type="text/css" scoped>
	/deep/ .van-nav-bar{background: #F4BE42;}
	/deep/ .van-nav-bar .van-icon{color: #333333;}
	/deep/ .van-nav-bar .van-nav-bar__text{color: #333333;}
	/deep/ .van-nav-bar__left, .van-nav-bar__right{padding: 0px 7px;}
				
	.goodsApprovePopup .list-goods-btns button:nth-of-type(2) span{color:#333333;}
	.list-goods-msg{padding: 10px;}
	.goods-msg-left{margin-right: 10px;display: flex;align-items: center;justify-content: space-between;float: left;}
	.goods-msg-left img{width:75px;height: 75px;display: inline-block;margin-left: 10px;}	
	.good-name{font-size: 15px;color: #F4BE42;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;}
	.good-account{font-size: 13px;color:#333333;margin-top:5px;margin-bottom: 10px;}
	.good-fee{font-size: 15px;color:#EA4646;}
	.list-goods-btns{text-align: right;}
	.list-goods-btns button{margin-right: 15px;border-radius: 5px;}
	.list-goods-btns .van-button--small {min-width: 65px;height: 28px;line-height:27px;}
	.goods-deal-title{color:#F4BE42;font-size: 15px;font-weight: bold;padding: 10px 40px;}
	.goods-deal-title span:first-of-type{margin-right: 20px;}
</style>