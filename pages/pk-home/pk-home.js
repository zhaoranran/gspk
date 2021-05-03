// pages/pk-home/pk-home.js
var App = getApp();
const Config = require('../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picture: `${Config.fileUrl}/files/logo2.png`,
    userInfo: {},
    yourUserInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.getUserInfoByOpenId(options.your);
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
  // 获取用户信息
  getUserInfoByOpenId(your) {
    this.setData({ userInfo: wx.getStorageSync('userInfo') });
    const that = this;
    wx.request({
      url: Config.service.loginUrl,
      method: 'get',
      dataType: 'json',
      data: { openId: your },
      success: function (res) {
        console.log(res);
        if (res.data.code === 0) {
          that.setData({ yourUserInfo: res.data.data });
        }
      },
      fail: function (error) {
        console.log('请求失败', error);
      }
    })
  },
  onPlay() {
    const that = this;
    setTimeout(function () {
      wx.navigateTo({
        url: "../pk-home/play?youOpenId=" + that.data.yourUserInfo.openId + "&youName=" + that.data.yourUserInfo.name,
      })
    }, 3000);
  },
})