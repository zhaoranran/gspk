// pages/home/home.js
const Config = require('../../config.js');
const backgroundAudioManager = wx.getBackgroundAudioManager();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{
      picture: `${Config.fileUrl}/files/logo2.png`,
      name:'',
      rank:'青铜',
      score:'',
      id: '',
    },
    userCount: '',
    time:'04-28 00:00:00',
    iconV: `${Config.fileUrl }/files/v.png`,
    iconStart: `${Config.fileUrl}/files/start.png`,
    list:[
    {
      title:'签到',
      icon:`${ Config.fileUrl }/files/sign.png`,
      onFun: 'onUserSign',
    },
    {
      title:'党务知识学习',
      icon: `${Config.fileUrl}/files/xx.png`,
      onFun: 'onKms',
    },
    {
      title:'时代楷模排位',
      icon:`${ Config.fileUrl }/files/pw.png`,
      onFun: 'onPk',
    },
    {
      title:'党建先锋榜',
      icon: `${Config.fileUrl}/files/bang.png`,
      onFun: 'onXf',
    },
    {
      title:'预赛赛制公告',
      icon:`${Config.fileUrl}/files/gg.png`,
      onFun: 'onGg',
    },
    {
      title:'设置',
      icon: `${Config.fileUrl}/files/sz.png`,
      onFun: 'onSet',
    },
    ],
    isShowSing:false,//是否显示签到
    isShowNotice:false,//是否显示预赛制公告
    isShowSet: false,
    audioCheck: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = wx.getStorageSync('userInfo') || {}
    console.log(userInfo);
    this.setData({
      userInfo: {
        picture: `${Config.fileUrl}/files/logo2.png`,
        name: userInfo.name,
        rank: '',
        score: userInfo.score,
        id: userInfo.id,
      }
    });
    this.getUserList();
    this.audioPlay();
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

  //获取用户数量
  getUserList() {
    const that = this;
    wx.request({
      url: Config.service.userAll,
      method: 'get',
      dataType: 'json',
      data: {},
      success: function (res) {
        console.log(res);
        if (res.data.code === 0) {
          that.setData({ userCount: res.data.data.length });
        }
      },
      fail: function (error) {
        console.log('请求失败', error);
      }
    })
  },
  // 用户签到
  onUserSign(){
    const that = this;
    const _userInfo = that.data.userInfo;
    wx.request({
      url: Config.service.userSign,
      method: 'post',
      dataType: 'json',
      data: { userId: _userInfo.id, score: 5 },
      success: function (res) {
        console.log(res);
        if (res.data.code === 0) {
          _userInfo.score = res.data.data;
          that.setData({ userInfo: _userInfo });
          that.setData({ isShowSing: true })
        } else {
          wx.showToast({
            title: '已经签到',
            icon: 'error',
            duration: 2000
          })
        }
      },
      fail: function (error) {
        console.log('请求失败', error);
      }
    })
  },
  onKms(){
    wx.navigateTo({
      url: '../../pages/daily/index'
    })
  },
  onPk(){
    wx.navigateTo({
      url: '../../pages/start-exam/start-exam'
    })
  },
  onXf(){
    wx.navigateTo({
      url: '../../pages/friend/friend'
    })
  },
  onGg(){
    this.setData({isShowNotice:true})
  },
  onClose() {
    this.setData({ isShowSing: false });
    this.setData({ isShowNotice: false });
    this.setData({ isShowSet: false });
  },
  onSet(){
    this.setData({ isShowSet: true });
  },

  
  audioChange(e){
    console.log(e);
    if(e.detail.value){
      this.setData({ audioCheck: true });
      this.audioPlay();
    } else {
      this.setData({ audioCheck: false });
      this.audioStop();
    }
  },

  audioPlay(){
    console.log('play');
    backgroundAudioManager.title = 'bg';
    backgroundAudioManager.src = `${Config.fileUrl}/files/bg.mp3`;
    backgroundAudioManager.play();
  },
  audioStop() {
    console.log('stop');
    backgroundAudioManager.stop();
  },
})