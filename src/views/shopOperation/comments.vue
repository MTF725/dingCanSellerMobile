<template>
	<!-- 用户评价 -->
	<div id="commentsPopup">
		<!-- 顶部导航 -->
		<van-nav-bar title="用户评价" left-text="门店运营" fixed placeholder right-text="" left-arrow @click-left="navTopBack"  />	
		<!-- popup内容区 -->
		<!-- 评价上部切换 -->
		<div class="comments-tab-empty">
			<div class="comments-tab">
				<p :class="{commentsTabColor:tabComments==0}" @click="tabCommentsBtn('用户评价')">
					<img src="../../assets/image/comments_comments.png" alt="">
					<span>用户评价</span>
				</p>
				<p :class="{commentsTabColor:tabComments==1}" @click="tabCommentsBtn('评价统计')">
					<img src="../../assets/image/comments_tongji.png" alt="">
					<span>评价统计</span>
				</p>
			</div>
		</div>
			
		<!-- 评价列表 -->		
		<div class="comments-list" v-show="tabComments==0">		
			<van-pull-refresh v-model="refreshing" @refresh="onRefresh" style="height:calc(100% - 62px;);">		
				<van-list v-model="loading" :finished="finished" finished-text="没有更多了" offset=1  @load="getCommentsAll">				
					<li class="comments-list-item clearfix" v-for="(item,index) in commentsArr" :key="index" ref="getheight">
						<div class="comments-list-msg">
							<div class="clm-title">
								<span>{{item.pName?item.pName:"匿名"}}</span>
								<span>{{item.createTime}}</span>
							</div>
						  <div class="clm-starts" v-for="(itemScore,indexScore) in item.items" :key="indexScore">									
								<p style="display:flex;align-items:center;">
									<span>{{itemScore.tipContent}}</span>
									<van-rate v-model="itemScore.score" color="#F6BD43" readonly size="14px"/>
								</p>									
							</div>
							<div class="clm-comments">{{item.commentContent}}</div>
						</div>
					</li>	
				</van-list>					
			</van-pull-refresh>
		</div>
	
		<!-- 统计列表 -->
		<div class="count-list" v-show="tabComments==1">
			<div class="count-list-top-empty">
				<div class="count-list-top-box">
					<div class="count-list-top">
						<div class="clt-left">
							<p>{{sellerScoreObj.score}}</p>
							<p>商家评分</p>
						</div>
						<div class="clt-right">
							<p><span>评价口碑</span><span class="clt-right-title">{{sellerScoreObj.title}}</span></p>
							<p>{{sellerScoreObj.remark}}</p>
						</div>
					</div>
				</div>
			</div>
			<van-pull-refresh v-model="refreshing2" @refresh="onRefresh2" style="height:calc(100% - 62px;);">
				<van-list v-model="loading2" :finished="finished2" finished-text="没有更多了" offset=1  @load="getGoodsComments">		
					<ul class="count-list-bottom">
						<li class="clb-item clearfix van-clearfix" v-for="(item,index) in goodsCommentsArr" :key="index">
							<img class="clb-item-sortimg" :src="item.num==1?goodsSortImg1:item.num==2?goodsSortImg2:item.num==3?goodsSortImg3:''" alt="">
							<img class="clb-item-left " :src="item.gPic==''?goodsDefaultImg:port+item.gPic" alt="">
							<div class="clb-item-right">
								<p>{{item.gName}}</p>
								<p><span>月销量</span><span>{{item.sellCounter}}</span></p>
							</div>
						</li>
					</ul>
				</van-list>
			</van-pull-refresh>
		</div>
	
	</div> 
</template>

<script>

	import goodsDefault from "../../assets/image/goods_default.png";//引入默认商品图
	import addPicImg from "../../assets/image/camera.png";//引入添加图片
	import commentsSort1 from "../../assets/image/comments_sort1.png";//引入商品排序1
	import commentsSort2 from "../../assets/image/comments_sort2.png";//引入商品排序2
	import commentsSort3 from "../../assets/image/comments_sort3.png";//引入商品排序3
	export default{
		name:"comments",
		data:function(){
			return{
				port:'http://192.168.1.252:9001',//链接
				goodsDefaultImg:goodsDefault,//默认商品图
				tabComments:0,//0-用户评价tab,1-评价统计tab
				commentsArr:[],//商家评价数据
				commentsTotal:0,//商家评价数据总条数
				commentsPageNum:1,//商家评价页码
				sellerScoreObj:{},//商家评分数据
				goodsCommentsArr:[],//商家商品评价数据
				goodsSortImg1:commentsSort1,//商品评价排序图1
				goodsSortImg2:commentsSort2,//商品评价排序图1
				goodsSortImg3:commentsSort3,//商品评价排序图1
			    totalNum:0,//总交易笔数
			    pageNum:0,//页码
			    loading: false,
			    finished: false,
			    refreshing: false,	
				totalNum2:0,//总交易笔数
				pageNum2:0,//页码
				loading2: false,
				finished2: false,
				refreshing2: false,			
			}
		},
		methods:{
			//返回键
			navTopBack(){
				this.$router.go(-1)
			},
			
			//用户评价tab切换
			tabCommentsBtn(e){
				console.log(e)
				if(e=="用户评价"){
					this.tabComments = 0;			
				}else if(e=="评价统计"){
					this.tabComments = 1;				
				}
			},
							
			//下拉刷新
			onRefresh() {				
				  this.finished = false;							
				  this.loading = true;
				  this.getCommentsAll()
			},
			
			//获取商家全部评价
			getCommentsAll(){	
				if (this.refreshing) {
				  this.commentsArr = [];				  
				  this.refreshing = false;
				  this.totalNum=0;//记录总数
				  this.pageNum=0;//页码				 
				}
				this.loading = true;						
				if (this.pageNum>1&&this.commentsArr.length >= this.totalNum) {
					this.finished = true;
					this.loading = false;
					return
				}		
				this.pageNum++;
				let data = {
					sellerId :this.$global.sellerId,
					pageNum :this.pageNum,
					pageSize :20,
				}
				this.$get("getCommentsAll",data).then(res=>{						
					this.totalNum = res.data.total;												
					if(res.status==200){
						res.data.list.forEach(item=>{
						this.commentsArr.push(item)						
					})
					console.log(this.commentsArr)
					this.loading = false;	
					}          
				}).catch(err=>{
					console.log(err)
				})
			},
				
			//获取商家评分
			getSellerScore(){
				this.$get("getSellerScore",{sellerId :this.$global.sellerId,cId :this.$global.cId}).then(res=>{
					console.log("获取商家评分",res)
					if(res.status==200){													 
						this.$set(this.sellerScoreObj,"score",res.data.score.toFixed(1)) 
						this.$set(this.sellerScoreObj,"title",res.data.title)  
						this.$set(this.sellerScoreObj,"remark",res.data.remark)      	  
					}						
				}).catch(err=>{
					console.log(err)
				})
			}	,
			
			//获取商家商品评价
			getGoodsComments(){
				if (this.refreshing2) {
					this.goodsCommentsArr = [];				  
					this.refreshing2 = false;
					this.totalNum2=0;//记录总数
					this.pageNum2=0;//页码				 
				}
				this.loading2 = true;						
				if (this.pageNum2>1&&this.goodsCommentsArr.length >= this.totalNum2) {
					this.finished2 = true;
					this.loading2 = false;
					return
				}		
				this.pageNum2++;
				let data = {
					sellerId :this.$global.sellerId,
					pageNum :this.pageNum2,
					pageSize :10,
				}
				this.$get("getSellerGoodsComments",data).then(res=>{
					console.log("获取商家商品评价",res)
					if(res.status==200){	
						res.data.list.forEach(item=>{						
							this.goodsCommentsArr.push(item)
						})											 
						console.log(this.goodsCommentsArr)
						this.loading2 = false;
					}						
				}).catch(err=>{
					console.log(err)
				})
			},
			
			//下拉刷新
			onRefresh2() {				
				  this.finished2 = false;							
				  this.loading2 = true;
				  this.getGoodsComments()
			},
			
			
			
		},
		created(){		
			this.getCommentsAll();
			this.getSellerScore();//获取商家评分
			this.getGoodsComments();//获取商家商品评价
		},
		mounted() {
			
		}
	}
	
</script>

<style scoped="scoped">
	/deep/ .van-nav-bar{background: #F4BE42;}
	/deep/ .van-nav-bar .van-icon{color: #333333;}
	/deep/ .van-nav-bar .van-nav-bar__text{color: #333333;}
	/deep/ .van-nav-bar__left, .van-nav-bar__right{padding: 0px 7px;}
	
	.commentsTabColor{background: #FFF5DF;}
	.comments-tab-empty{height: 46px;}
	.comments-tab{margin-bottom: 5px;background: white;display: flex;align-items: center;position: fixed;top: 46px;left: 0;right: 0;z-index: 10;}
	.comments-tab p {width: 50%;box-sizing: border-box;height: 41px;line-height: 41px;color:#333333;font-size: 14px;display: flex;align-items: center;justify-content: center}
	.comments-tab img{display: inline-block;width: 16px;height: 15px;margin-right: 5px;}
	.comments-list{background: #F9F9F9;}
	.comments-list-item{padding: 10px 10px;position: relative;background: white;}
	.comments-list-item:not(:last-of-type){border-bottom: 1px solid #E9E9E9;}	
	.clm-title span:first-of-type{font-size: 15px;font-weight: bold;color:#333333}
	.clm-title span:last-of-type{font-size: 14px;color:#999999;position: absolute;right: 15px;}
	.clm-starts p{font-size: 14px;color:#999999;}
	.clm-starts p{display: flex;align-items: center;}
	.clm-starts p span{margin-right: 5px;width: 65px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
	.clm-comments p {font-size: 15px;color:#333333}
	.comments-list-msg>div{line-height: 22px;}
	.count-list-top-empty{height: 99px;}
	.count-list-top-box{background: #F9F9F9;position: fixed;left: 0;right: 0;top: 86px;z-index: 10;height: 104px;padding-top:5px ;}
	.count-list-top{display: flex;padding: 15px 0 ;background: white;}
	.count-list-bottom{padding: 0 15px ;background: white;margin-top: 5px;}
	.count-list-bottom li{padding:15px 10px;border-bottom:1px solid #E9E9E9;}
	.clt-left{border-right: 1px solid #DDDDDD;padding: 0 10px;text-align: center;width: 25%;}
	.clt-left p:first-of-type{color:#FFBD27;font-size: 32px;font-weight: bold;margin-bottom: 10px;}
	.clt-left p:last-of-type{color:#333333;font-size: 13px;}
	.clt-right{padding: 0 10px;width: 75%;}
	.clt-right p:first-of-type{margin-bottom: 10px;}
	.clt-right p:first-of-type span:first-of-type{font-size: 14px;color: #333333;margin-right: 10px;}
	.clt-right p:last-of-type{font-size: 13px;color: #333333;line-height: 22px;}
	.clt-right-title{color:#FFBD27;font-size: 25px;}
	.clb-item{position: relative;}
	.clb-item-left{display: block;width:75px;height:75px;margin-right: 15px;float: left;}
	.clb-item-right p:first-of-type{font-size: 17px;color:#333333;font-weight: bold;font-family: PingFang SC;margin-bottom: 30px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;}
	.clb-item-right p:last-of-type{font-size: 13px;font-weight: Medium;color:#999999;}
	.clb-item-right p:last-of-type span:first-of-type{margin-right: 5px;}
	.clb-item-sortimg{display: inline-block;width: 27px;height:27px;position: absolute;top:2px;left: 0;}
</style>
