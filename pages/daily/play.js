// pages/exam/exam.js
var App = getApp();
const Config = require('../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    exam: {
      time: 30 * 60 * 60 * 1000,
      examTitle: '1，【单选题】在抗日战争中，除了国内各民族团结一致之外，海 外华人华侨筹赈祖国难民总会是战时人数最多，成绩斐然的抗日 救国华侨',
      examList: [
        { exam: '1', id: 0 },
        { exam: '士大夫', id: 1 },
      ],
    },
    counttime: 600,
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
    availableTimes: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('***************');
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
      });
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
      data: { size: 30 },
      success: function (res) {
        console.log(res);
        if (res.data.code === 0) {
          that.setData({ queList: res.data.data });
          console.log(index);
          that.setData({ que: res.data.data[index] });
          console.log(that.data.que);
          that.countDown(that, 600);
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
      return;
    }
    that.setData({ queIndex: index });
    that.setData({ que: that.data.queList[index] });
    if (that.data.curQueIsOk) {
      that.setData({
        okCount: that.data.okCount + 1,
      });
    }
  },
  countDown(that, count) {
    if (count == 0) {
      that.setData({
        counttime: count,
        disabled: false
      })
      return;
    }
    that.setData({
      counttime: count
    })
    setTimeout(function () {
      count--;
      that.countDown(that, count);
    }, 1000);
  },
})