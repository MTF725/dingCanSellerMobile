<template>
	<div class="login">
		<div class="bg"><img src="../assets/login/login-bg.png" alt=""></div>
		<div class="bg-food"><img src="../assets/login/login-bgfood.png" alt=""></div>
		<div class="content">
			<div class="title">
				<p>网上订餐</p>
			</div>
			<div>
				<div class="input-item">
					<img src="../assets/login/username.png" alt="">
					<van-field class="login-input" v-model="userName"  placeholder="用户名" />
				</div>
				<div class="input-item">
					<img src="../assets/login/password.png" alt="">
					<van-field class="login-input" v-model="passWord" type="password"  placeholder="密码" />
				</div>
			</div>
			<div class="confirm">
				<van-button color="#F4BE42" type="primary" block @click="logIn()">登录</van-button>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">	
	export default {
		name:"login",
		data: function() {
			return {
				userName:"",
				passWord:""
			};
		},
		methods: {
			
			// 登录
			logIn() {      
				var _this = this
				
				//判断输入框是否为空
				if(_this.userName==""){
					_this.$toast("请输入用户名");
					return;
				}
				if(_this.passWord==""){
					_this.$toast("请输入密码");
					return;
				}				
				var load = _this.$toast.loading({
					message: '登录中...',
					duration: 0,
					forbidClick: true,
				});
				
				//东北大学108  北京大学119
				 this.$post("logIn",{username:119 + '/'+this.userName,password:this.passWord}).then(res=>{					
					 if(res.status==200){
							localStorage.setItem('sendLogin',true)
							load.clear();
							_this.$toast("登录成功");
							localStorage.setItem('cIdS',res.data.cId)
							localStorage.setItem('sellerNameS',res.data.sellerName)
							localStorage.setItem('sellerIdS',res.data.sellerId)
							localStorage.setItem('winIdS',res.data.winId)
							
							this.$global.sellerId = res.data.sellerId;
							this.$global.cId = res.data.cId
							setTimeout(()=>{
									_this.$router.push({path:'/mine'})
								},1000)
						}else{
								_this.$toast(data.data.msg);
						}
				 }).catch(err=>{
					 console.log(err)
				 })
				
			},

		},
		created: function() {
			
			// var cNo=getUrlKey('cNo');//获取url编号参数
			// if(cNo){
			// 	localStorage.setItem('sNo',cNo);
			// }
			// this.getUnitNo(localStorage.getItem('sNo'))//传入配送员单位编号
		}
	};
</script>
<style scoped="scoped" type="text/css">
html,body{height: 100%;}
	.login {
		position: fixed;
		width: 100%;
		height: 100%;

	}

	.bg {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 1;
	}

	.bg img {
		width: 100%;
		height: 100%;
		z-index: inherit;
	}

	.bg-food {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
	}

	.bg-food img {
		width: 100%;
		height: 100%;
		z-index: inherit;
	}

	.content {
		position: absolute;
		width: 100%;
		height: 100%;
		left: 0;
		top: 0;
		z-index: 2;
		padding: 0 20px;
		box-sizing: border-box;
	}

	.title {
		font-size: 30px;
		font-family: FZZongYi-M05S;
		font-weight: 400;
		color: white;
		width: 100%;
		text-align: center;
		margin-top: 116px;
		margin-bottom: 60px;

	}

	.confirm {
		width: 100%;
		font-size: 20px;
		text-align: center;
		margin-top: 35px;
		border: 0;
	}

	.confirm-btn {
		background: #F4BE42;
		border: 0;
		border-radius: 6px;
		font-size: 20px;
		font-family: PingFang SC;
		font-weight: 500;
		color: white;
	}

	.input-box {
		background: #898482;	
	}

	.input-item {
		color: #FFFFFF;
		display: flex;
		align-items: center;
		background:#898482;		
		border-radius: 5px;
		margin-bottom: 20px;
		overflow: hidden;
	}

	.input-item img {
		width:24px;
		height: 24px;	
		margin:0 12px;
		margin-right: 0;
	}

	.login-input {
		background: #898482;	
	}
	
</style>
