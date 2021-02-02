// 基础共同的配置
let baseConfig = {
  //搜索历史storage关键字
  searchHistoryKey: 'search_history_list',
  //小程序appid
  appid: 'wx0daef1d93d212171',
  // 环境变量，dev, test, prod
  ENV: 'dev',
  //请求超时时间设置
  reqTimeout: 10000,
  // header所存放的常量
  header: {

  },
}

// 根据不同环境变量，不同的配置
let envConfig = {
  dev: {
    host: 'https://3e6cce87-b3ff-41bb-8cae-cc2743ce48cd.bspapp.com',
    // host: 'http://10.10.10.229:9004/',//伍宏辉
    // host: 'http://192.168.0.132:8088/',//怀博
    // host: 'http://192.168.0.133:8082/weixin/',//东略
    // host: 'http://192.168.0.117:8084/',//显豪
    // host: 'http://192.168.0.131:8088/',//东略2
    imgHost: 'http://dev.image.foodsyoyo.com/',
    // payHost:'http://feiyan.payment.foodsyoyo.com/',//支付接口
    mock: false,
  },
  // test: {
  //   host: 'http://192.168.100.95:8090/',
  //   // host: 'https://test2.wechat.foodsyoyo.com',//域名
  //   imgHost: 'http://newtest2.image.foodsyoyo.com/',
  //   // payHost:'https://dev.payment.foodsyoyo.com/',
  //   mock: false,
  // },
  // prod: {
  //   host   : 'https://m.greenchoicechina.com/',
  //   imgHost: 'http://image.greenchoicechina.com/',
  //   // payHost:'https://payment.greenchoicechina.com',
  //   mock          : false,
  //   isConsole     : true,    //是否打印接口相关信息(不填默认true)
  //   isBaiDu_mjt   : true,    //是否上报百度统计相关信息(不填默认false)
  //   isSendMerchant: true,    //是否设置微信商品收录(不填默认false)
  // },
}

// 合并配置
let config = Object.assign(baseConfig, envConfig[baseConfig.ENV])

const getApiAppName = function (url) {
  if (!url) {
    return
  } else if (url.indexOf("http") >= 0) {
    return url
  }

  return `${config.host}${url}`
}

config.apiAppName = getApiAppName

export default config
