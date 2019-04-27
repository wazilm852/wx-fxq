// pages/center/balance/balance.js
const app = getApp();

var config = require("../../../config.js");
var util = require("../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: null,
    buycount: null,
    freetime: null,
    used: null,
    orderlist: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this;
    self.getBalance();
    self.getOrder();
  },

  /**
   * 请求账户余额接口
   */
  getBalance: function(){
    const self = this;
    var userid = app.globalData.fxq_userInfo.userid;
    var url = config.service.mybalance;
    var header = { 'Authorization': app.globalData.fxq_userInfo.token };
    var data = {
      userid: userid,
      token: app.globalData.fxq_userInfo.token
    };

    if (app.globalData.fxq_userInfo.identity == 3) {
      url = config.service.mybalance2
      data.companyid = app.globalData.fxq_userInfo.companyid
    }

    wx.request({
      method: "POST",
      url: url,
      header: header,
      data:data,
      success: function (res){
        self.setData({
          balance: res.data.content.balance,
          buycount: res.data.content.buycount,
          freetime: res.data.content.freetime,
          used: res.data.content.used
        })
      }
    })

  },

  /**
   * 获取套餐
   */
  getOrder: function () {
      const self = this;

      var url = config.service.getPersonOrder;
      var header = { 'Authorization': app.globalData.fxq_userInfo.token };
      console.log(app.globalData.fxq_userInfo)
      var token = app.globalData.fxq_userInfo.token;
      var userid = app.globalData.fxq_userInfo.userid;
      var type = app.globalData.fxq_userInfo.identity == 3 || app.globalData.fxq_userInfo.identity == 2?1:0;

      var data = {
        token: token,
        type: type,
        userid: userid
      };

      wx.request({
        method: "POST",
        url: url,
        header: header,
        data: data,
        success: function(res){
          self.setData({
            orderlist: res.data.content
          })
        }
      })
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

  }
})