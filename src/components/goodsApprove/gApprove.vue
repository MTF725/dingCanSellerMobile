<template>
	<!-- 审批中列表 -->
	<div class="box" style="background: #F9F9F9;">
		<van-pull-refresh v-model="refreshing" @refresh="onRefresh" style="height:calc(100% - 62px;);">
			<ul class="goods-deal-list" style="background: white;">
				<van-list v-model="loading" :finished="finished" finished-text="没有更多了" offset=1  @load="getOperateList">				
					<li v-for="(item,index) in goodsOperateArr" :key="index">
						<div class="list-goods-msg clearfix">
							<div class="goods-msg-left">
								<img :src="item.gPic==''?goodsDefaultImg:port+item.gPic" alt="">
							</div>												
							<div class="goods-msg-right">
								<p class="good-name">{{item.gName}}</p>			
								<div class="list-goods-btns">
									<div class="approve-btns">
										<van-button plain color="#427DF4" type="primary" size="small">审核中</van-button>
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
					gAuditState : 0 , //审核状态0审核中1已审核2已驳回
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
								this.goodsOperateArr.push(item)
							})						
						}							
						this.loading = false;
					}								
				}).catch(errGoods=>{
					console.log(errGoods)
				})																
			},
			 
			//下拉刷新
			onRefresh() {
			   // 清空列表数据
			   this.finished = false;
			   this.loading = true;
			   this.getOperateList()
			 },		
			 
			//查看详情			 
			sellOnEdit(e){		
			 	this.$router.push({path:"goodBuild",query:{goodsData:this.goodsOperateArr[e],fromBtn:"商品审批详情"}})
			},
		},
			 
		created(){						
			//this.getOperateList();//查找审批中商品数据		
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
	.goodsManagePopup	.list-goods-btns button span{color: #333333;}
	
</style>