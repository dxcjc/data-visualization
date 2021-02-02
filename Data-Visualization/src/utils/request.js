import config from '../config/config';
import md5 from '../resources/js/md5';
import axios from "axios";

// import autoAuth from './autoAuth';

//记录请求过的request
//不用{}是考虑内存占用问题
let hashList = [];

// let autoAuthTimes = 0;//登录重请求次数

//根据状态码，处理不同情况的错误信息
//返回false表示不需要处理此状态码
async function handerErrorStatus(statusCode, response, promise, options) {

  // const app = getApp();

  if (statusCode == 502 || statusCode == 503) {
    if (!options.isSilent) {
      alert('服务器开小差')
    }
    return true
  }

  if (statusCode == 401) {
    //登录失效处理

    //
    return true
  }

  if (statusCode == 400) {

    return true
  }

  if (typeof response.data == 'string' && response.data.search('<title>会员登录</title>') > -1) {
    console.log('登录失效')

    // app.globalData.isLogin = false;

    // //防重，请求5次不成功,则跳出循环
    // if (autoAuthTimes > 4) {
    //   autoAuthTimes = 0;
    //   returnApply true;
    // }
    // autoAuthTimes = autoAuthTimes + 1;

    // if (await autoAuth()) {
    //   autoAuthTimes = 0;
    //   //把重新请求的结果返回去
    //   promise.resolve(init(options))
    // }

    return true
  }

  return false
}

//请求参数处理
function formatOption(options) {

  // const app = getApp();

  //处理请求错误时，是否自动提示
  options.isSilent = options.isSilent || false;

  //处理请求发现token错误时，是否跳转登录
  options.tokenSilent = options.tokenSilent || false;

  //url处理
  if (typeof options.url === 'undefined') {
    throw new Error('API:wx.request url(param) is required')
  } else {
    //拼接host域名
    options.url = config.apiAppName(options.url)
  }

  //mothod处理
  if (options.method) {
    //转大写
    options.method = (options.method + '').toUpperCase()
  }

  //timeout处理
  if (typeof options.timeout === 'undefined') {
    options.timeout = config.reqTimeout || 15000;
  }

  //header处理
  options.header = options.header || {}
  options.header = Object.assign({
    // 'token': wx.getStorageSync(config.authName) || '',
    // 'Cookie': (app && app.globalData.sessionId) || '',//放在这，会导致登录重请求死循环
    'content-type': 'application/json;charset=utf-8'
  }, config.header, options.header, {'token': (app && app.globalData.token) || ''})

  return options
}

//请求方法封装成Promise
function request(options) {

  const isConsole = config.isConsole !== false;

  // console.log('hash:', hashList)

  isConsole && console.log('发送请求:', options.url, '\n参数:', options);

  // return new Promise(function (resolve, reject) {

    //防重处理
    let hash = md5(JSON.stringify({data: options.data, method: options.method, url: options.url}));
    if (hashList.indexOf(hash) != -1) { return reject(`cancel repeat request!(${options.url})`) }
    hashList.push(hash)
    setTimeout(() => {
      //1000ms之后，可以重新请求
      (hashList.indexOf(hash) != -1) && hashList.splice(hashList.indexOf(hash), 1)
    }, 1000)
    let instance = axios.create({
      ...options,
    });
  instance.interceptors.request.use(async function (res) {
      let {cookies, data, header, statusCode} = res;

      isConsole && console.log('发送返回:', res);
      //处理错误状态码
      if (await handerErrorStatus(statusCode, res, {resolve, reject}, options)) {
        reject('失败了')
      } else {

        if (statusCode == 200) {
          //200状态码-数据处理
          if (!data.code) {
            if (!!data) {
              data = {data, code: 0, msg: ''}
            } else {
              data = {data}
            }
          } else if ((data.code == 401 || data.code == 402 || data.code == 403 || data.code == 405) && !options.tokenSilent) {
            console.log(data.msg)
            wx.navigateTo({
              url: '/pages/login/login',
            })
          } else if (data.code == -1) {
            wx.showToast({title: '服务异常', icon: 'none'})
          }
        } else {
          //非200状态码(排除handerErrorStatus特殊处理过的状态码)-数据处理
          data = {code: -1}
        }

        resolve({...data, statusCode, responseCookies: cookies, responseHeader: header})
      }
    }, function (res) {
    //请求超时
    if (res.errMsg && res.errMsg.indexOf('timeout') != -1 && !options.isSilent) {
      wx.showToast({title: '连接超时', image: '../../resources/images/common/network.png'})
    }

    reject(res)
  })
  return instance

    // wx.request({
    //
    //   success: async function (res) {
    //     let {cookies, data, header, statusCode} = res;
    //
    //     isConsole && console.log('发送返回:', res);
    //     //处理错误状态码
    //     if (await handerErrorStatus(statusCode, res, {resolve, reject}, options)) {
    //       reject('失败了')
    //     } else {
    //
    //       if (statusCode == 200) {
    //         //200状态码-数据处理
    //         if (!data.code) {
    //           if (!!data) {
    //             data = {data, code: 0, msg: ''}
    //           } else {
    //             data = {data}
    //           }
    //         } else if ((data.code == 401 || data.code == 402 || data.code == 403 || data.code == 405) && !options.tokenSilent) {
    //           console.log(data.msg)
    //           wx.navigateTo({
    //             url: '/pages/login/login',
    //           })
    //         } else if (data.code == -1) {
    //           wx.showToast({title: '服务异常', icon: 'none'})
    //         }
    //       } else {
    //         //非200状态码(排除handerErrorStatus特殊处理过的状态码)-数据处理
    //         data = {code: -1}
    //       }
    //
    //       resolve({...data, statusCode, responseCookies: cookies, responseHeader: header})
    //     }
    //   },
    //   fail: function (res) {
    //     //请求超时
    //     if (res.errMsg && res.errMsg.indexOf('timeout') != -1 && !options.isSilent) {
    //       wx.showToast({title: '连接超时', image: '../../resources/images/common/network.png'})
    //     }
    //
    //     reject(res)
    //   },
    //   complete: function () {
    //     //请求完成后，可以重新请求
    //     (hashList.indexOf(hash) != -1) && hashList.splice(hashList.indexOf(hash), 1);
    //   }
    // })
  // })
}

function init(options) {

  options = formatOption(options)

  return request(options)
}

export default init
