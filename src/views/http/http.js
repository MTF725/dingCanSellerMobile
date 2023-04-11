import axios from 'axios'
import Url from './url'
import {Toast} from 'vant'; //vant动画
import QS from 'qs'; // 引入qs模块
import router from 'vue-router';

// document.cookie = "username=John Doe";
const URL = 'http://192.168.1.252:9001'

   // var port = 'http://192.168.1.100:9001'; //本地
   // var port1 = 'http://192.168.1.100:2003';//总后台本地（商家二维码展示时使用）
   
   //var port = 'http://192.168.1.252:9001'; //服务
   // var port1 = 'http://192.168.1.252:2003'; //总后台服务（商家二维码展示时使用）

  /////线上
  //var port = 'http://shopmanage.ngrok2.xiaomiqiu.cn'; //线上
  //var port1 = 'http://ordermeal.ngrok2.xiaomiqiu.cn'; //线上（商家二维码展示时使用）


  // websockt
  // var wsPort='192.168.1.100:9101';//本地
  // var wsPort='192.168.1.252:9101';//服务
  var wsPort='ordermealw.ngrok2.xiaomiqiu.cn';//线上

axios.defaults.timeout = 10*1000 //默认请求超时时间 20S
axios.defaults.withCredentials = true;//携带cookie
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

//axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

// 响应拦截器
axios.interceptors.response.use(  
    response => {  		
        // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据     
        // 否则的话抛出错误
        if (response.status === 200) { 		
			//如果请求成功,但是状态不是200,则给予提示
			if(response.data.status!=200){			
				Toast(response.data.msg)
			}
			if(response.data.msg==="未登录"){
				Toast("您已下线,请重新登录");				
				// setTimeout(()=> {
				// 	this.$router.push('/login');
				// }, 1500);
				
			}
            return Promise.resolve(response);        
        } else {  			
            return Promise.reject(response);        
        }  		
    },
	error => {	
	    if(error.message.includes('timeout')){ // 判断请求异常信息中是否含有超时timeout字符串
			 Toast('请求超时，请稍后再试')
			 return Promise.reject(error);// reject这个错误信息
		}
		Toast('网络连接失败，请稍后再试')	
		return Promise.reject(error);		
	}
);

// get 请求
export function get(url, data) {	
	return new Promise((resolve, reject) => {
		axios.get(URL + Url[url], {params: data}).then(response => {       
			resolve(response.data);		
		}).catch(err => {
		reject(err)         
		})
	})
}

// post 请求
export function post(url, data) {	
	return new Promise((resolve, reject) => {
		axios.post(URL + Url[url],QS.stringify(data)).then((response) => {
			resolve(response.data)//成功结果	 
			console.log("请求成功：",response.data)
		}).catch((error)=>{
			reject(error)//失败结果		
			console.log("请求失败：",error)    
		})
	})
}

// put 请求
export function put(url, data) { 	
	return new Promise((resolve, reject) => {
		axios.put(URL + Url[url],QS.stringify(data)).then((response) => {
			resolve(response.data)//成功结果
			console.log("请求成功：",response.data)
		}).catch((error)=>{
			reject(error)//失败结果
			console.log("请求失败：",error)      
		})
	})
}
//delete 请求
export function del(url, data) {
	return new Promise((resolve, reject) => {
		axios.delete(URL + Url[url],{data:data}).then((response) => {
			resolve(response.data)//成功结果
			console.log("请求成功：",response.data)
		}).catch((error)=>{
			reject(error)//失败结果
			console.log("请求失败：",error)		
		})
	})
}
//delete  上传数组请求
export function delArr(url, data) { 
	return new Promise((resolve, reject) => {		
		axios.delete(URL + Url[url]+"?"+QS.stringify(data,{arrayFormat: 'brackets'})).then((response) => {
			resolve(response.data)//成功结果
			console.log("请求成功：",response.data)
		}).catch((error)=>{
			reject(error)//失败结果
			console.log("请求失败：",error)
		})		 
	})	
}

// formData请求
export function fromDataPost(url, data) {
	return new Promise((resolve, reject) => {		
		axios.post(URL + Url[url], data).then(response => {
			resolve(response.data)//成功结果		
		}).catch(err => {
			reject(err)		
			console.log("请求失败：",err)
		})
	})
}

// post上传数组请求
export function postArr(url, data) { 	
	return new Promise((resolve, reject) => {	
		axios.post(URL + Url[url],QS.stringify(data, {arrayFormat: 'brackets'})).then((response) => {
			resolve(response.data)//成功结果
		}).catch((error)=>{
			reject(error)//失败结果
			console.log("请求失败：",error)      
		})
	})
}



// function setCookie(name, value, exdays) {
//   let cookie = name + "=" + value + ";";
//   if (exdays) {
//     let d = new Date();
//     d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
//     let expires = "expires=" + d.toGMTString();
//     cookie = cookie + ' ' + expires;
//   }
//   console.log(cookie)
//   document.cookie = cookie;
// }


// function getCookie(cname) {
//   let name = cname + "=";
//   let cookie = document.cookie.split(';');
//   for (let i = 0, len = cookie.length; i < len; i++) {
//     let c = cookie[i].trim();
//     if (c.indexOf(name) == 0) {
//       return c.substring(name.length, c.length);
//     }
//   }
//   return "";

// }
