// pages/verify/person/info.js

const app = getApp();
var config = require('../../../config.js')
var util = require('../../../utils/util.js')
var regex = require('../../../utils/regex.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: null,
    identity:null
  },

  onLoad:function(){
    
  },

  next(e) {
    if (!this.data.username || !this.data.identity){
      wx.showToast({
        title: config.message.M1033,
        icon: 'none'
      })
      setTimeout(function () {
        wx.hideToast()
      }, config.delay)

      return false
    } else if (!regex.IDENTITY_CARD_18.test(this.data.identity)){
      wx.showToast({
        title: config.message.M1037,
        icon: 'none'
      })
      setTimeout(function () {
        wx.hideToast()
      }, config.delay)
      return false
    }

    wx.navigateTo({
      url: 'face?name=' + this.data.username + '&identity=' + this.data.identity,
    })
  },

  /**
   * 获取姓名
   */
  getName: function(e)
  {
    this.setData({
      username: e.detail.value
    })
  },

  /**
   * 获取输入的身份证号码
   */
  getIdentity: function (e)
  {
    if (!regex.IDENTITY_CARD_18.test(e.detail.value)) {
      wx.showToast({
        title: config.message.M1037,
        icon: 'none',
        duration: 1000,
        mask: true
      })
    } else {
      this.setData({
        identity: e.detail.value
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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