// pages/exam/exam.js
var App = getApp();
const Config = require('../../config.js');
function dateformat(second) {
  // 分钟
  var min = Math.floor(second / 60 % 60);
  // 秒
  var sec = Math.floor(second % 60);
  return min + ':' + sec;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    counttime: 180,
    queList: [],
    que: {},
    queIndex: 0,
    queIsTrue: {
      img: '',
      okNo: '',
      id: '',
    },
    okCount: 0,
    curQueIsOk: false,
    time: '',
    socketStatus: 'closed',
    myUser: { okCount: 0,},
    youInfo: { okCount: 0,},
    userInfo: {},
    yourUserInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('***************');
    this.setData({ yourUserInfo: { openId: options.youOpenId,name: options.youName},
      userInfo: wx.getStorageSync("userInfo"),
    });
    this.getQueList(0);
    this.openSocket();
  },

  examTap(e) {
    const that = this;
    const imgD = `${Config.fileUrl}/files/dui.png`;
    const imgC = `${Config.fileUrl}/files/cuo.png`;
    console.log(e);
    if (e.currentTarget.dataset.code === e.currentTarget.dataset.answer) {
      that.setData({
        queIsTrue: { img: imgD, okNo: 'isTrue', id: e.currentTarget.dataset.id },
        curQueIsOk: true,
      });
      // 发送正确消息到服务器
      const data = {};
      data.openId = wx.getStorageSync('userInfo').openId;
      data.type = 'play';
      data.okCount = that.data.myUser.okCount + 1;
      wx.sendSocketMessage({
        data: JSON.stringify(data),
      })
    } else {
      that.setData({
        queIsTrue: { img: imgC, okNo: 'isFalse', id: e.currentTarget.dataset.id },
        curQueIsOk: false,
      });
    }
  },

  // 获取题列表
  getQueList(index) {
    const that = this;
    wx.request({
      url: Config.service.findQue,
      method: 'get',
      dataType: 'json',
      data: { size: 18 },
      success: function (res) {
        console.log(res);
        if (res.data.code === 0) {
          that.setData({ queList: res.data.data });
          console.log(index);
          that.setData({ que: res.data.data[index] });
          console.log(that.data.que);
          that.countDown(that, 180);
        }
      },
      fail: function (error) {
        console.log('请求失败', error);
      }
    })
  },
  // 下一题列表
  nextQueList() {
    const that = this;
    const index = that.data.queIndex + 1;
    if (index === that.data.queList.length) {
      // 计算答题结果
      let okCount = 0;
      if (that.data.myUser.okCount > that.data.youInfo.okCount) {
        okCount = 1;
      }
      wx.navigateTo({
        url: '../../pages/exam-success/exam-success?okCount=' + okCount
      })
      return;
    }
    that.setData({ queIndex: index });
    that.setData({ que: that.data.queList[index] });
  },
  countDown(that, count) {
    if (count == 0) {
      this.nextQueList();
      that.setData({
        counttime: 180,
        time: dateformat(count),
      })
      return;
    }
    that.setData({
      counttime: count,
      time: dateformat(count),
    })
    setTimeout(function () {
      count--;
      that.countDown(that, count);
    }, 1000);
  },

  openSocket() {
    //打开时的动作
    wx.onSocketOpen(() => {
      console.log('WebSocket 已连接')
      this.data.socketStatus = 'connected';
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
        if (result.type === 'play') {
          if (this.data.myUser.openId === result.openId) {
            // 弹出邀请弹窗
            const _user = this.data.myUser;
            _user.okCount = result.okCount;
            this.setData({ myUser: _user});
          }
          if (this.data.youInfo.openId === result.openId) {
            // 弹出邀请弹窗
            const _user = this.data.youInfo;
            _user.okCount = result.okCount;
            this.setData({ youInfo: _user });
          }
          this.nextQueList();
        }
      }
      console.log("【websocket监听到消息】内容如下：");
      console.log(message);
    })
    // 打开信道
    wx.connectSocket({
      url: "wss://" + "free.liaoningdoupo.com" + "/ws",
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
})