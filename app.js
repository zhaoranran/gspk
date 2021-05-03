// app.js
App({
  onLaunch() {
    const that = this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          //获取openId
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session',
            data: {
              //小程序唯一标识
              appid: 'wx82c5fbf511c0837d',
              //小程序的 app secret
              secret: 'a249895ef4ced5d1b1e7d7283a1b92cb',
              grant_type: 'authorization_code',
              js_code: res.code
            },
            method: 'GET',
            header: { 'content-type': 'application/json' },
            success: function (openIdRes) {
              console.info("登录成功返回的openId：" + openIdRes.data.openid);
              // 判断openId是否获取成功
              if (openIdRes.data.openid != null & openIdRes.data.openid != undefined) {
                that.globalData.openId = openIdRes.data.openid
                that.globalData.cookie = 'JSESSIONID=' + openIdRes.data.openid
                wx.setStorageSync('openId', openIdRes.data.openid);
              } else {
                console.info("获取用户openId失败");
              }
            },
            fail: function (error) {
              console.info("获取用户openId失败");
              console.info(error);
            }
          })
        }
      }
    })
  },
  
  globalData: {
    openId: null,
    userInfo: null,
    cookie: null,
    socketStatus: 'closed',
  }
})
