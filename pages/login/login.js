// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,//是否显示弹出层
    showFx:false,//是否显示分行数据列表
    inputStyle:{
      placeholderStyle:'color:#5e5e5e;font-size:13px;',
      customStyle:'border-bottom:1rpx solid #636363;margin-bottom:20px;'
    },
    checked:false,
    fxDate:[
      {text:'四川省分行',id:1},
      {text:'成都分行',id:2},
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  //点击获取分行数据
  getFxDate(){
    this.setData({showFx:true})
  },
  radioChange(event) {
    this.setData({
      checked: event.detail,
    });

  },

})