<template>
	<!-- 新建公告 -->
	<div class="buildNotice">
		<p class="buildNotice-title"><span class="start-span">*</span>公告内容</p>
		<div class="type-msg-box">
			<van-field v-model="noticeBuildContent" autosize  maxlength="100" show-word-limit type="textarea" size="large"/>		
		</div>
		<div class="btn-box">
			<van-button @click="noticeBuildConfirm" type="primary" size="large">提交</van-button>
		</div>	
	</div>			
</template>

<script>
	import { Toast } from 'vant';
	export default{
		name:"NoticeBuild",
		data:function(){
			return{
				//公告				
				noticeControl:false,//公告管理部分
				noticeBuildContent:"",//创建公告内容
				noticeControlAppr:true,//公告管理审批中
				noticeControlPass:false,//公告管理已通过
				noticeControlReject:false,//公告管理已驳回
				noticeControlPublish:false,//公告管理已发布
			}
		},
		methods:{
			//创建公告确定
			noticeBuildConfirm(){
				//待审批-1；待发布-2；已驳回-3；已发布-4
				if(this.noticeBuildContent.trim()==""){
					this.$toast("公告内容不能为空")
					return;
				}
				let data = {
					sellerId :this.$global.sellerId ,
					content :this.noticeBuildContent,
					noticeState :1
				}
				Toast.loading({
				    message: '发布中',
				    forbidClick: true,
				    loadingType: 'spinner',
					duration:0
				});
				this.$post("addNotice",data).then(res=>{
					Toast.clear();
					if(res.status==200){
						this.$toast("提交成功");
						this.noticeBuildContent = "";
					}
					console.log(res)
				}).catch(err=>{
					Toast.clear()
					console.log(err)
				})		 
			},
			
		}
	}
</script>

<style scoped="scoped">
	
	.type-msg-box{border:1px solid #DDDDDD;border-radius: 5px;}
	.type-msg-box .van-field{padding: 5px 8px;border-radius: 5px;} 
	.btn-box{text-align: center;margin-top: 40px;margin-bottom: 15px;}
	.btn-box .van-button--large {width: 100%;height: 45px;line-height:45px;border-radius: 5px;}
	.btn-box .van-button--primary{background:#F26666 ;border-color:#F26666;}
	.btn-box .van-button--primary span{color:white;font-size: 16px;}

	.buildNotice{padding: 0 15px;}
	.noticeColor{color:#F4BE42!important}
	.buildNotice-title{padding: 10px 0;font-size: 15px;color: #333333;}
	.buildNotice-title span{color:#E74242;margin-right: 5px;}
	.buildNotice .btn-box .van-button--primary{background: #F4BE42;border: 1px solid #F4BE42;}
	.buildNotice .btn-box span{color:#333333;}
	
	
</style>
