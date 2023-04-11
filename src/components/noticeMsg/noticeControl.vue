<template>
	<!-- 公告管理 -->
	<div id="noticeControl">
		<div class="time-select-empty" v-show="timePupup">
			<div class="time-select-box">
				<div class="time-select" >
					<p @click="timeSelect('begin')"><span>{{beginTime}}</span><img src="../../assets/image/DatetimePicker.png"><span class="iconfont icon-jiantou9"></span></p>
					<p @click="timeSelect('end')"><span>{{endTime}}</span><img src="../../assets/image/DatetimePicker.png"><span class="iconfont icon-jiantou9"></span></p>
				</div>
			</div>
		</div>
		<van-pull-refresh v-model="refreshing" @refresh="onRefresh" style="height:calc(100% - 62px;);">	
			<ul class="notice-list">
				<van-list v-model="loading" :finished="finished" finished-text="没有更多了" offset=1  @load="getNotice(nState)">				
				<!-- 	<li class="notice-list-none" v-show="noticeArr.length==0">暂无记录</li> -->
					<li class="notice-list-item" v-for="(item,index) in noticeArr" :key="index">
						<van-checkbox v-model="checkboxResult[index].checked" v-show="hasCheckbox" checked-color="#F4BE42" @click="checkboxChange(index)"></van-checkbox>
						<div class="notice-list-content" :class="{noticeCheck:hasCheckbox}">
							<p><span>公告内容:</span><span>{{item.content}}</span></p>
							<p><span>申请日期:</span><span>{{item.createTime}}</span></p>
							<p class="notice-state" :style="stateColor">{{judgeNoticeState(item.noticeState)}}</p>
						</div>
					</li>					
				</van-list>		
			</ul>
		</van-pull-refresh>
		
		<!-- 时间选择popup -->
		<van-popup v-model="timeSelectShow" position="bottom" :style="{width:'100%', height: '270px'}">
			<van-datetime-picker v-model="defaultTime" v-on:confirm="setTime" v-on:cancel="timeSelectShow=false"  type="date" title="选择日期" />
		</van-popup>
	</div>			
</template>

<script>
	import { Toast } from 'vant';
	export default{
		name:"noticeControl",
		data:function(){
			return{				
				nState:"",//状态
				noticeArr:[],//公告数组
				stateColor:"",//状态字体颜色
				timeSelectShow:false,//展示时间选择弹窗 
				timeType:"",//时间类型
				beginTime:"请选择日期",//开始时间
				endTime:"请选择日期",//结束时间
				defaultTime: new Date(),//日历默认时间
				timePupup:false,//时间导航
				hasCheckbox:false,//有多选框
				checkboxResult:[],
				totalNum:0,//总交易笔数
				pageNum:0,//页码
				loading: false,
				finished: false,
				refreshing: false,
			}
		},
		methods:{					
			//获取公告信息
			getNotice(e){	
				this.nState=e;
				if(this.nState==1){
					this.stateColor = {color:"#427DF4"} 
				}else if(this.nState==2){
					this.stateColor ={color:"#39AD27"}  
				}else if(this.nState==3){
					this.stateColor ={color:"#F26666"}   
				}else if(this.nState==4){
					this.stateColor ={color:"#F4BE42"}   
				}			
				if (this.refreshing) {
				  this.noticeArr = [];
				  this.checkboxResult = [];
				  this.refreshing = false;
				  this.totalNum=0;//记录总数
				  this.pageNum=0;//页码				 
				}
				this.loading = true;						
				if (this.pageNum>0&&this.noticeArr.length >= this.totalNum) {
					this.finished = true;
					this.loading = false;
					return
				}			
				this.pageNum++;
				let data={
					pageSize: 20, //页面大小
					pageNum: this.pageNum, //页码
					sellerId :this.$global.sellerId, //商家Id 
					startDate: this.beginTime=="请选择日期"?"":this.beginTime,//开始日期 
					endDate : this.endTime=="请选择日期"?"":this.endTime,//结束日期
					noticeState : this.nState,//状态id
					stateColor:"",//状态字体颜色
				}
				this.$get("getNotice",data).then(res=>{	
					console.log(res.data)
					if(res.status==200){
						this.totalNum =  res.data.total;
						res.data.list.forEach(item=>{							
							this.noticeArr.push(item)
							this.checkboxResult.push({noticeId:item.noticeId,checked:false})
						})				
					}
					this.loading=false;
				}).catch(err=>{
					console.log(err)
				})	
			},
			
			//公告发布
			pubilishBtn(){	
				let pubilishIds=[];
				this.checkboxResult.forEach(item=>{
					if(item.checked==true){
						pubilishIds.push(item.noticeId)
					}
				})
				if(pubilishIds.length==0){
					this.$toast("请选择要发布的公告");
					return
				}
				let data={
					noticeId: pubilishIds,
					noticeState :4 
				}				
				this.$toast.loading({
					message: '提交中...',
					duration: 0,
					forbidClick: true,
					loadingType: 'spinner',
				});			
				this.$postArr("publishNotice",data).then(res=>{					
					if(res.status == 200){
						this.$toast("发布成功")
						this.noticeArr = [];
						this.checkboxResult = [];
						this.refreshing = false;
						this.totalNum=0;//记录总数
						this.pageNum=0;//页码			
						this.getNotice(2);											
					}
				}).catch(err=>{					
					console.log(err)
				})
			},
			
			//下拉刷新
			onRefresh() {
			  // 清空列表数据
			  this.finished = false;
			  this.loading = true;
			  this.getNotice(this.nState)
			},		
			
			 //公告状态判断
			judgeNoticeState(e){
				let noticestate="";
				  switch(e){
					case 1:
						noticestate = "待审批";
						break;
					case 2:
						noticestate = "待发布";
						break;  
					case 3:
						noticestate = "已驳回";
						break;  
					case 4:
						noticestate = "已发布";
						break;
				  }
				  return noticestate;
			},
			
			//确定时间
			setTime(e){		
				console.log("选定时间",e,"时间类型",this.timeType)
				switch(this.timeType){
					case "begin":
						this.beginTime = this.dealTime(e);			
						break;
					case "end":
						this.endTime = this.dealTime(e);
						break;					
				}
				this.timeSelectShow=false;
				if(this.$parent.noticeControlAppr==true){
					this.getNotice(1);
				}else if(this.$parent.noticeControlPass==true){
					this.getNotice(2);
				}else if(this.$parent.noticeControlReject==true){
					this.getNotice(3);
				}else if(this.$parent.noticeControlPublish==true){
					this.getNotice(4);
				}
													 
			},
		
			//选择时间
			timeSelect(e){
				this.timeSelectShow=true;
				this.timeType = e;		
			},
			
			//处理vant日期数据格式
			dealTime(time){
				let year = time.getFullYear();
				let month = time.getMonth() + 1;		
				let day = time.getDate();		
				// return  year + '年' + month + '月'+ day + '日';	
				return  year + '-' + month + '-'+ day;	
			},
			
			//多选框选择
			checkboxChange(e){
				this.checkboxResult[e].checked=!this.checkboxResult[e].checked;			
			}
			
		},
		created(){
			this.getNotice(1);	//获取公告信息 
			
		}
	}
</script>

<style scoped="scoped">
	.notice-list .notice-list-item{background:white;margin-bottom: 5px;padding: 10px 15px;display: flex;}
	.notice-list .notice-list-item .van-checkbox{margin-right: 10px;}
	.notice-list .notice-list-item .notice-list-content{width: 100%;}
	.notice-list .notice-list-item p:not(:last-of-type){line-height: 22px;font-size: 14px;color: #333333;margin-bottom: 5px;}
	.notice-list .notice-list-item p span:nth-of-type(1){margin-right: 5px;}
	.notice-state{text-align: right;}
	.notice-list .notice-list-none{background:#F6F6F6;text-align: center; padding: 10px 15px;}
	.noticeCheck{width: 90%!important;}
		
	.nCApprColor{color:#427DF4!important;}
	.nCPassColor{color:#39AD27!important;}
	.nCRejectColor{color:#F26666!important;}
	.nCPublishColor{color:#F4BE42!important;}
	
	.time-select-empty{height: 47px;}
	.time-select-box{position: fixed;left: 0;right: 0;z-index: 10;padding-bottom: 5px;background: #F6F6F6;}
	.time-select{height: 42px;display: flex;align-items: center;background: white;}
	.time-select p{text-align: center;width: 50%;line-height: 42px;box-sizing: border-box;position: relative;}
	.time-select p:active{opacity: 0.8;}
	.time-select p:not(:last-of-type){border-right:1px solid #E9E9E9;}
	.time-select p img{display: inline-block;width: 16px;margin-left: 5px;margin-right: 5px;position: absolute;right:43px;top: 50%;transform: translateY(-50%);}
	.time-select p span:nth-of-type(1){margin-right: 23px;}
	.time-select p span:nth-of-type(2){color:#B1B1B1;font-size: 13px;position: absolute;right: 10px;top: 50%;transform: translateY(-50%);}

</style>
