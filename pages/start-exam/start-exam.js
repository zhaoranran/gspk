// pages/start-exam/start-exam.js
var App = getApp();
const Config = require('../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isStart:false,//是否开始竞赛
    youUserInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  startTap(){
    this.setData({isStart:true})
    // 自动寻找在线对手
    this.getUserList();
    console.log('----------------------');
    console.log(this.data.youUserInfo);
    
    // 进入比赛
    
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

  getUserList(){
    const that = this;
    const userMy = wx.getStorageSync("userInfo");
    wx.request({
      url: Config.service.userAll,
      method: 'get',
      dataType: 'json',
      data: {},
      success: function (res) {
        if (res.data.code === 0) {
          let _data = res.data.data.filter(item => item.openId != userMy.openId);
          const userInfo = _data[Math.random() * _data.length | 0];
          that.setData({ youUserInfo: userInfo });
          setTimeout(function () {
            wx.navigateTo({
              url: "../start-exam/play?youOpenId=" + that.data.youUserInfo.openId + "&youName=" + that.data.youUserInfo.name,
            })
          }, 5000);
        }
      },
      fail: function (error) {
        console.log('请求失败', error);
      }
    })
  }
})