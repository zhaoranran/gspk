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
    nextCount: 0,
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
        okCount: that.data.myUser.okCount + 1,
      });
      // 发送正确消息到服务器
    } else {
      that.setData({
        queIsTrue: { img: imgC, okNo: 'isFalse', id: e.currentTarget.dataset.id },
        curQueIsOk: false,
      });
    }
    this.nextQueList();
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
      if (that.data.myUser.okCount > 15){
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
    let _nextCount = that.data.nextCount + 1;
    if (count == 0) {
      let okCount = 0;
      if (that.data.myUser.okCount > 15) {
        okCount = 1;
      }
      wx.navigateTo({
        url: '../../pages/exam-success/exam-success?okCount=' + okCount
      })
      return;
    }
    that.setData({
      counttime: count,
      nextCount: _nextCount,
      time: dateformat(count),
    })
    if (_nextCount === 11) {
      that.nextQueList();
      that.setData({
        nextCount: 0,
      })
    }
    setTimeout(function () {
      count--;
      that.countDown(that, count);
    }, 1000);
  },

})