// pages/home/home.js
const Config = require('../../config.js');
var util = require('../../utils/util.js'); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    socketStatus: 'closed',
    onlineUserList: [],
    topImg: `${Config.fileUrl}/files/logo2.png`,
    footerImg: `${Config.fileUrl}/files/logo.png`,
    yqShow: false,
    yzShow: false,
    userInfo: {},
    yourUser: {},
    showUserInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.selOnlineUser();
    this.openSocket();
    
    this.setData({userInfo: wx.getStorageSync("userInfo")});
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.closeSocket();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  onClose() {
    this.setData({ yqShow: false });
  },
  openSocket() {
    //打开时的动作
    wx.onSocketOpen(() => {
      console.log('WebSocket 已连接')
      this.data.socketStatus = 'connected';
      this.sendMessage();
    })
    //断开时的动作
    wx.onSocketClose(() => {
      console.log('WebSocket 已断开')
      this.data.socketStatus = 'closed'
    })
    //报错时的动作
    wx.onSocketError(error => {
      console.error('socket error:', error)
    })
    // 监听服务器推送的消息
    wx.onSocketMessage(message => {
      //把JSONStr转为JSON
      console.log(message);
      const openId = wx.getStorageSync('userInfo').openId;
      if (message) {
        var result = JSON.parse(message.data);
        if (result.type === 'pk'){
          if (result.status === 'ready'){
            if (openId === result.your){
              // 弹出邀请弹窗
              this.setData({ yzShow: true});
              this.getUserInfoByOpenId(result.my);
            }
          } else if (result.status === 'start') {
            if (openId === result.your || openId === result.my) {
              // 进入比赛页面
              wx.navigateTo({
                url: '../../pages/pk-home/pk-home?my='+result.my+'&your='+result.your
              })
            }
          } else if (result.status === 'exit') {
            const _userList = this.data.onlineUserList.filter(item => item.openId !== result.openId)
            this.setData({
               onlineUserList: _userList,
            });
          }
        }
      }
      console.log("【websocket监听到消息】内容如下：");
      console.log(message);
    })
    // 打开信道
    wx.connectSocket({
      // url: "wss://" + "free.liaoningdoupo.com" + "/ws",
      url: "ws://" + "127.0.0.1:8888" + "/ws",
    })
  },

  // 发送退出消息
  closeSocketMsg() {
    if (this.data.socketStatus === 'connected') {
      // 发送断开信息用户在线退出
      const data = {};
      data.openId = wx.getStorageSync('userInfo').openId;
      data.type = 'exit';
      wx.sendSocketMessage({
        data: JSON.stringify(data),
      })
    }
  },

  //关闭信道
  closeSocket() {
    console.log(22222);
    if (this.data.socketStatus === 'connected') {
      // 发送断开信息用户在线退出
      wx.closeSocket({
        success: () => {
          this.data.socketStatus = 'closed'
        }
      })
    }
  },

  //发送在线消息函数
  sendMessage() {
    console.log(2222222222);
    if (this.data.socketStatus === 'connected') {
      //自定义的发给后台识别的参数 ，我这里发送的是name
      const data = {};
      data.openId = wx.getStorageSync('userInfo').openId;
      data.type = 'join';
      
      wx.sendSocketMessage({
        data: JSON.stringify(data),
      })
    }
  },

  // 发送邀请用户信息
  addUser(event){
    
    if (event.currentTarget.dataset.online === '0'){
      wx.showToast({
        title: '请邀请在线用户',
        icon: 'error',
        duration: 2000
      })
      return;
    }
    this.setData({ yqShow: true });
    this.setData({ yourUser: { name: event.currentTarget.dataset.name } });
    if (this.data.socketStatus === 'connected') {
      //自定义的发给后台识别的参数 ，我这里发送的是name
      const data = {};
      data.my = wx.getStorageSync('userInfo').openId;
      data.type = 'pk';
      data.your = event.currentTarget.dataset.openid;
      data.roomId = util.wxuuid();
      console.log(event.currentTarget.dataset);
      wx.sendSocketMessage({
        data: JSON.stringify(data),
      })
    }
  },

  // 查询所有在线用户
  selOnlineUser() {
    const that = this;
    wx.request({
      url: Config.service.userOnline,
      method: 'get',
      dataType: 'json',
      data: {},
      success: function (res) {
        console.log(res);
        if (res.data.code === 0) {
          let _data = res.data.data;
          _data.sort(function (a, b) { return b.score - a.score; })
          that.setData({ onlineUserList: _data });
        }
      },
      fail: function (error) {
        console.log('请求失败', error);
      }
    })
  },
  // 获取用户信息
  getUserInfoByOpenId(my) {
    const that = this;
    wx.request({
      url: Config.service.loginUrl,
      method: 'get',
      dataType: 'json',
      data: { openId: my },
      success: function (res) {
        console.log(res);
        if (res.data.code === 0) {
          that.setData({ showUserInfo: res.data.data });
        }
      },
      fail: function (error) {
        console.log('请求失败', error);
      }
    })
  },

})