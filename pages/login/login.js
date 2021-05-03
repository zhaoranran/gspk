// pages/login/login.js
var App = getApp();
const Config = require('../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,//是否显示弹出层
    showFx:false,//是否显示分行数据列表
    name: '',
    offices: '',
    deptId: '',
    deptName: '',
    openId: '',
    inputStyle:{
      placeholderStyle:'color:#5e5e5e;font-size:13px;',
      customStyle:'border-bottom:1rpx solid #636363;margin-bottom:20px;'
    },
    checked:false,
    fxDate:[],
    registBtnShow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHdOpenId();
    console.log(11111111111);
    console.log(this.data.openId);
    // this.getOpenId().then(function (res) {
    //     if (res.status == 200) {
    //       that.setData({
    //         openId: wx.setStorageSync('openId',res.data)
    //       })
    //       that.setData({
    //         openId: res.data,
    //       })
    //       console.log('用户openid', that.data.openId)
    //       that.getUserInfo(that.data.openId);
    //     } else {
    //       console.log(res.data);
    //     }
    //   });
    
    
  },

  showPopup(event) {
    this.setData({show:true})
    console.log(event.detail);
  },

  onClose() {
    this.setData({ show: false });
  },
  fxOnClose(){
    this.setData({ showFx: false });
  },
  // 获取用户信息
  getUserInfo(obj){
    const that = this;
    console.log(obj);
    console.log('**************');
    wx.request({
      url: Config.service.loginUrl,
      method: 'get',
      dataType: 'json',
      data: { openId: obj},
      success: function (res) {
        console.log(res);
        if (res.data.code === 0) {
          wx.setStorageSync('userInfo', res.data.data);
          wx.navigateTo({
            url: '../../pages/home/home'
          })
        } else {
          that.setData({ registBtnShow: true });
        }
      },
      fail: function (error) {
        console.log('请求失败', error);
      }
    })
  },
  //点击获取分行数据
  getFxDate(){
    this.setData({showFx:true});
    const that = this;
    wx.request({
      url: Config.service.deptList,
      method: 'get',
      dataType: 'json',
      data: {},
      success: function (res) {
        console.log(res);
        if(res.data.code === 0){
          that.setData({ fxDate: res.data.data});
        }
      },
      fail: function (error) {
        console.log('请求失败', error);
      }
    })
  },
  radioChange(event) {
    this.setData({
      checked: event.detail,
    });

  },
  onChange(e){
    this.setData({
      [e.currentTarget.dataset.value]: e.detail
    })
  },
  onSelect(event){
    this.setData({
      deptId: event.currentTarget.dataset.id,
      deptName: event.currentTarget.dataset.name,
      showFx: false
    });
    console.log(this.data);
  },
  onSave(){
    const that = this;
    const _userForm = {};
    if (!this.data.name){
      wx.showToast({
        title: '请输入用户名',
        icon: 'error',
        duration: 2000
      })
      return;
    }
    if (!this.data.deptId) {
      wx.showToast({
        title: '请选择分行',
        icon: 'error',
        duration: 2000
      })
      return;
    }
    if (!this.data.offices) {
      wx.showToast({
        title: '请输入部门',
        icon: 'error',
        duration: 2000
      })
      return;
    }
    if (!this.data.checked) {
      wx.showToast({
        title: '请勾选协议',
        icon: 'error',
        duration: 2000
      })
      return;
    }
    _userForm.name = this.data.name;
    _userForm.deptId = this.data.deptId;
    _userForm.deptName = this.data.deptName;
    _userForm.offices = this.data.offices;
    _userForm.openId = wx.getStorageSync('openId');
    console.log(_userForm);
    wx.request({
      url: Config.service.saveUser,
      method: 'post',
      dataType: 'json',
      data: _userForm,
      success: function (res) {
        console.log(res);
        if (res.data.code === 0) {
          // 注册成功跳转
          wx.navigateTo({
            url: '../../pages/register/register'
          })
        }
      },
      fail: function (error) {
        console.log('请求失败', error);
      }
    })
  },
  getOpenId: function () {
    var that = this
    return new Promise(function (resolve, reject) {
      wx.login({
        success: function (res) {
          //code 获取用户信息的凭证
          if (res.code) {
            //请求获取用户openid
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
                  wx.setStorageSync('openId', openIdRes.data.openid);
                  var res = {
                    status: 200,
                    data: openIdRes.data.openid
                  }
                  resolve(res);
                } else {
                  console.info("获取用户openId失败");
                }
              },
              fail: function (error) {
                console.info("获取用户openId失败");
                console.info(error);
              }
            });
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
            reject('error');
          }
        }
      })
    });
  },

  getHdOpenId: function () {
    var that = this
    wx.login({
      success: function (res) {
        //code 获取用户信息的凭证
        if (res.code) {
          //请求获取用户openid
          wx.request({
            url: Config.service.getOpenId,
            method: 'get',
            dataType: 'json',
            data: { code: res.code },
            success: function (res) {
              console.log(res);
              if (res.data.code === 0) {
                console.log('获取后端openid' + res.data.data.openid);
                that.setData({ openId: res.data.data.openid });
                wx.setStorageSync('openId', res.data.data.openid);
                that.getUserInfo(res.data.data.openid);
              }
            },
            fail: function (error) {
              console.log('请求失败', error);
            }
          })
        }
      }
    })
  },
})