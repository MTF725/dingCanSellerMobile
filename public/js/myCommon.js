
//常用正则表达式
const integerReg=/^[0-9]+$/;//大于等于0的整数
const zzsReg = /^\+?[1-9]\d*$/; //大于0的整数
const zsReg = /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/; //大于0的数（包括小数）
const ddlReg = /^\d+(?=\.{0,1}\d+$|$)/;//大于等于0（包含小数）
const phongReg = /^1[3456789]\d{9}$/; //手机号码
const idCardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; //身份证
const dateReg=/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;//日期xxxx-xx-xx
const pointTwoReg = /^\d+(\.\d{0,2})?$/; //小数点后最多两位
const posReg = /^\d+(\.\d+)?$/; //非负浮点数

const sellerId = localStorage.getItem("sellerIdS");//商家id
const cId = localStorage.getItem("cIdS");//学校id
const delUrl = 'http://192.168.1.252:9001';//删除方法时使用的url

// websockt
// const wsPort='192.168.1.100:9101';//本地
 const wsPort='192.168.1.252:9101';//服务
//const wsPort='ordermealw.ngrok2.xiaomiqiu.cn';//线上


export default
  {
    sellerId,cId,integerReg,zzsReg,zsReg,ddlReg,phongReg,idCardReg,dateReg,pointTwoReg,posReg,delUrl,wsPort
  }
 
 // 获取系统日期：年月日
  export function getSystemDate(dataType) {
     var myDate = new Date();
     var year = myDate.getFullYear(); //年
     var month = myDate.getMonth() + 1; //月
     var day = myDate.getDate(); //日
     var hours = myDate.getHours(); //时
     var min = myDate.getMinutes(); //分
     var second = myDate.getSeconds();//秒
     if (month < 10) {
         month = '0' + month;
     }
     if (day < 10) {
         day = '0' + day;
     }
     if (hours < 10) {
         hours = '0' + hours;
     }
     if (min < 10) {
         min = '0' + min;
     }
     if (second < 10) {
         second = '0' + second;
     }
	 
	 if (dataType == 'month') {
	     return year + '-' + month;
	 }
     if (dataType == 'day') {
         return year + '-' + month + '-' + day;
     }
     if (dataType == 'minute') {
         return year + '-' + month + '-' + day + ' ' + hours + ':' + min;
     }
     if (dataType == 'second') {
		return year + '-' + month + '-' + day + ' ' + hours + ':' + min +':' + second;  
	}
	
	if (dataType == 'month2') {
		return year + '年' + month+ '月';
	}
	if (dataType == 'day2') {
	    return year + '年' + month + '月' + day + '日';
	}
	if (dataType == 'minute2') {
	     return year + '年' + month + '月' + day + '日 ' + hours + '时' + min + '分';
	 }
	 if (dataType == 'second2') {
		 return year + '年' + month + '月' + day + '日 ' + hours + '时' + min + '分'+ second + '秒';
	}
 }
 
 
 //时间转秒 
 export function getSecond(e){   
    var secondArr = e.split(":");
    var secondText="";     
    if(secondArr[0]!=""&&secondArr[1]!=""){ 
      secondText = secondArr[0]*60+secondArr[1]*1;     
      return secondText       
    }
     return 0
  }