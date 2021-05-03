// pages/daily/index.js
const App = getApp();
const Config = require('../../config.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        availableTimes: 1, // 挑战剩余次数
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      this.getCount();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        wx.hideShareMenu(); // 隐藏转发按钮
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        // this.getAnswerTimes();
        // this.getGameRules();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {},

    /**开始答题 */
    startGame() {
        if (this.data.availableTimes <= 0) {
            wx.showModal('提示', '今日挑战次数已用完！')
        } else {
          wx.navigateTo({
              url: "../../pages/exam/exam"
          });
        }
    },
  onPlay(){
    wx.navigateTo({
      url: "../daily/play"
    });
  },

  getCount(){
    const _userInfo = wx.getStorageSync('userInfo');
    const that = this;
    wx.request({
      url: Config.service.dailyCount + '/' + _userInfo.openId,
      method: 'get',
      dataType: 'json',
      data: {},
      success: function (res) {
        console.log(res);
        if (res.data.code === 0) {
          that.setData({ availableTimes: res.data.data });
        }
      },
      fail: function (error) {
        console.log('请求失败', error);
      }
    })
  },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {}
})