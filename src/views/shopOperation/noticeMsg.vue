<template>
	<!-- 公告信息弹窗 -->
	<div class="noticePopup" :style="backgroundColor">	
		<!-- 顶部导航 -->
		<van-nav-bar :title="noticeBuild?'新建公告':'公告管理'" left-text="门店运营" fixed placeholder :right-text="pubilish" left-arrow @click-left="navTopBack" @click-right="pubilishBtn" />	
		<!-- 新建公告 -->
		<NoticeBuild v-show="noticeBuild"></NoticeBuild>	
		<!-- 公告管理 -->
		<NoticeControl v-show="noticeControl" ref="noticeControl"></NoticeControl>
		
		<!-- 新建公告底部导航 -->
		<div class="noticeBuild-nav" v-show="noticeBuild">
			<!-- 底部空白填充 -->
			<div class="goodsManagePopup-foot-empty"></div>
			<!-- 底部切换 -->
			<div class="goodsManagePopup-foot">
				<div class="foot-item" @click="tabSwitchBuild('新建公告')" :class={noticeColor:noticeBuild} >
					<span class="iconfont icon-xinjian"></span><span>新建公告</span>
				</div>
				<div class="foot-item" @click="tabSwitchBuild('公告管理')" :class={noticeColor:noticeControl}>
					<span class="iconfont icon-gonggao"></span><span>公告管理</span>
				</div>					
			</div>	
		</div>	
		<!-- 公告管理底部导航 -->
		<div class="noticeControl-nav"  v-show="noticeControl">
			<!-- 底部空白填充 -->
			<div class="goodsManagePopup-foot-empty"></div>
			<!-- 底部切换 -->
			<div class="goodsManagePopup-foot">
				<div class="foot-item" @click="tabSwitchControl('公告管理待审批')" :class={nCApprColor:noticeControlAppr} >
					<span class="iconfont icon-shenhezhong"></span><span>待审批</span>
				</div>
				<div class="foot-item" @click="tabSwitchControl('公告管理待发布')" :class={nCPassColor:noticeControlPass}>
					<span class="iconfont icon-yitongguo"></span><span>待发布</span>
				</div>	
				<div class="foot-item" @click="tabSwitchControl('公告管理已驳回')" :class={nCRejectColor:noticeControlReject}>
					<span class="iconfont icon-yitongguo"></span><span>已驳回</span>
				</div>	
				<div class="foot-item" @click="tabSwitchControl('公告管理已发布')" :class={nCPublishColor:noticeControlPublish}>
					<span class="iconfont icon-yitongguo"></span><span>已发布</span>
				</div>					
			</div>
		</div>
				
	</div>
</template>

<script>

	import NoticeBuild from '../../components/noticeMsg/noticeBuild.vue';//新建公告组件
	import NoticeControl from '../../components/noticeMsg/noticeControl.vue';//公告管理组件
	export default{	
		name:"noticeMsg",
		components:{NoticeBuild,NoticeControl},
		data:function(){
			return{
				//公告
				noticeBuild:true,//新建公告部分
				noticeControl:false,//公告管理部分
				noticeBuildContent:"",//创建公告内容
				noticeControlAppr:true,//公告管理待审批
				noticeControlPass:false,//公告管理待发布
				noticeControlReject:false,//公告管理已驳回
				noticeControlPublish:false,//公告管理已发布
				backgroundColor:{background:"white"},//主页背景色
				pubilish:"",//导航发布按钮		
			}
		},
		methods:{
			//返回键
			navTopBack(){
				if(this.noticeBuild==true){
					this.$router.go(-1)
				}else{
					this.tabSwitchBuild("新建公告")
				}
			},
				
			//创建公告底部导航		
			tabSwitchBuild(e){
				if(e=="新建公告"){
					this.noticeBuild = true;
					this.noticeControl = false;					
					this.backgroundColor = {background:"white"};
					this.pubilish = "";
				}else if(e=="公告管理"){
					this.noticeBuild = false;
					this.noticeControl = true;
					this.backgroundColor = {background:"#F6F6F6"};
					this.pubilish = "";
				}
			},
			
			//公告管理底部导航
			tabSwitchControl(e){
				this.$refs.noticeControl.beginTime="请选择日期";
				this.$refs.noticeControl.endTime="请选择日期";
				this.$refs.noticeControl.hasCheckbox = false;
				this.$refs.noticeControl.noticeArr = [];
				this.$refs.noticeControl.checkboxResult = [];
				this.$refs.noticeControl.pageNum = 0;
				this.pubilish = "";
				this.$refs.noticeControl.timePupup=true;
				this.noticeControlAppr = false;
				this.noticeControlPass = false;
				this.noticeControlReject = false;
				this.noticeControlPublish = false;
				if(e=="公告管理待审批"){
					this.noticeControlAppr = true;				
					this.$refs.noticeControl.getNotice(1);					
					this.$refs.noticeControl.timePupup=false;
				}else if(e=="公告管理待发布"){				
					this.noticeControlPass = true;				
					this.$refs.noticeControl.getNotice(2);
					this.pubilish = "发布";					
					this.$refs.noticeControl.hasCheckbox = true;
				}else if(e=="公告管理已驳回"){				
					this.noticeControlReject = true;					
					this.$refs.noticeControl.getNotice(3);				
				}else if(e=="公告管理已发布"){				
					this.noticeControlPublish = true;
					this.$refs.noticeControl.getNotice(4);					
									
				}						
			},	
					
			//公告发布
			pubilishBtn(){
				this.$refs.noticeControl.pubilishBtn();
			
			}
		},
		created(){
			
		}
	}
</script>

<style scoped>
	/deep/ .van-nav-bar{background: #F4BE42;}
	/deep/ .van-nav-bar .van-icon{color: #333333;}
	/deep/ .van-nav-bar .van-nav-bar__text{color: #333333;}
	/deep/ .van-nav-bar__left, .van-nav-bar__right{padding: 0px 7px;}
	
	.noticePopup{height: 100%;}
	.goodsManagePopup-foot-empty{height: 39px;}
	.goodsManagePopup-foot{display: flex;flex-wrap: wrap;position: fixed;bottom: 0;right: 0;left: 0;font-size: 13px;}
	.foot-item{width: 25%;text-align: center;border-right: 1px solid #E9E9E9;box-sizing: border-box;padding: 10px 0;}
	.foot-item:last-of-type{border-right: 0;}
	.foot-item span:first-of-type{margin-right: 3px;}
	.type-msg-box{border:1px solid #DDDDDD;border-radius: 5px;}
	.type-msg-box .van-field{padding: 5px 8px;border-radius: 5px;} 
	
	.btn-box{text-align: center;margin-top: 40px;margin-bottom: 15px;}
	.btn-box .van-button--large {width: 100%;height: 45px;line-height:45px;border-radius: 5px;}
	.btn-box .van-button--primary{background:#F26666 ;border-color:#F26666;}
	.btn-box .van-button--primary span{color:white;font-size: 16px;}
	
	.footColor{color:#F4BE42;}
	.noticePopup .popup-main{background: white;padding: 0 15px;}
	.noticePopup .foot-item{width:50%;border-top: 1px solid #E9E9E9;color:#BFBFBF;}
	.noticePopup .foot-item:first-of-type span:first-of-type{font-size: 18px;}
	.noticeColor{color:#F4BE42!important}
	.buildNotice-title{padding: 10px 0;font-size: 15px;color: #333333;}
	.buildNotice-title span{color:#E74242;margin-right: 5px;}
	.buildNotice .btn-box .van-button--primary{background: #F4BE42;border: 1px solid #F4BE42;}
	.buildNotice .btn-box span{color:#333333;}
	.noticeControl-nav .foot-item{width:25%;border-top: 1px solid #E9E9E9;color:#666666;}
	.noticeControl-nav .goodsManagePopup-foot{background: white;}
	.nCApprColor{color:#427DF4!important;}
	.nCPassColor{color:#39AD27!important;}
	.nCRejectColor{color:#F26666!important;}
	.nCPublishColor{color:#F4BE42!important;}
</style>
