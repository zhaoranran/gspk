// pages/exam-success/exam-success.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isTrue:false,//答题是否成功
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.okCount === 1) {
      that.setData({
        isTrue: true,
      });
      this.onUserSign();
    } else {
      that.setData({
        isTrue: false,
      });
    }
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
  // 用户签到
  onUserSign() {
    const that = this;
    const _userInfo = wx.getStorageSync('userInfo');
    let score = -10;
    if (that.data.isTrue){
      score = 10;
    }
    wx.request({
      url: Config.service.userScore,
      method: 'post',
      dataType: 'json',
      data: { userId: _userInfo.id, score: score },
      success: function (res) {
        console.log(res);
      },
      fail: function (error) {
        console.log('请求失败', error);
      }
    })
    
  },
})