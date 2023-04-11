<template>
  <div id="app">  
	  <!-- 底部导航 -->
		<div class="index-footer-nav" v-show="$route.name == 'mine'||$route.name == 'shopOperation'||$route.name == 'orderManage'||$route.name == 'orderPending'" >		
			<router-link to="/orderPending">
				<i class="iconfont icon-shiliangzhinengduixiang"></i>
				<p>待处理</p>
			</router-link>
			<router-link to="/orderManage">
				<i class="iconfont icon-dingdanguanli"></i>
				<p>订单管理</p>
			</router-link>
			<router-link to="/shopOperation">
				<i class="iconfont icon-shangdian"></i>
				<p>门店运营</p>
			</router-link>
				<router-link to="/mine">
				<i class="iconfont icon--wode"></i>
				<p>我的</p>
			</router-link>
		</div>
		<keep-alive :include="cached">
			<router-view></router-view>
		</keep-alive>
		<!-- <transition :name="transitionName">
		    <keep-alive :include="cached">
		    	<router-view></router-view>
		    </keep-alive>
		</transition> -->
	
  </div>
</template>

<script type="text/javascript">

 export default{
	name:"App",
 	data:function(){
 		return {
			  cached: this.$store.state.catchArr,
			  transitionName:''
		};
 	},
	watch: {
		$route: {
			//监听路由变化
			handler: function(to, from) {
				this.cached = this.$store.state.catchArr;
				// console.log(to.meta.index ,from.meta.index )	
				// 页面切换动画设置    如果to索引大于from索引,判断为前进状态,反之则为后退状态
				if (to.meta.index > from.meta.index){
				  // 设置动画名称
				  this.transitionName = 'slide-left';
				} else{
				   this.transitionName = 'slide-right';
				}
			}
	    },		
	},	
	
 }
</script>
<style>
	html,body,#app{
	  height: 100%;
	  position: relative;
	}
	.slide-right-enter-active,
	.slide-right-leave-active,
	.slide-left-enter-active,
	.slide-left-leave-active {
	    will-change: transform;
	    transition: all 300ms;
	    position: absolute; 
	}
	.slide-right-enter {
	    opacity: 0;
	    transform: translate3d(-100%, 0, 0);
	}
	.slide-right-leave-active {
	   opacity: 0;
	   transform: translate3d(100%, 0, 0);
	}
	.slide-left-enter {
	   opacity: 0;
	   transform: translate3d(100%, 0, 0);
    }
	.slide-left-leave-active {
	   opacity: 0;
	   transform: translate3d(-100%, 0, 0);
	}
	
</style>
