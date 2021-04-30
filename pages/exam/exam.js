// pages/exam/exam.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    exam:{
      time: 30 * 60 * 60 * 1000,
      examTitle:'1，【单选题】在抗日战争中，除了国内各民族团结一致之外，海 外华人华侨筹赈祖国难民总会是战时人数最多，成绩斐然的抗日 救国华侨',
      examList:[
        {exam:'1',id:0},
        {exam:'士大夫',id:1},
      ]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  examTap(e){

  }
})