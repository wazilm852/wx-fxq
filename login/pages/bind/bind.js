// pages/bind/bind.js
var config = require('../../../config.js')

//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    focus:true,
    phone:null,
    password:null,
    code:null
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
  
  },

  // 获取输入手机号
  bindblurPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  // 获取输入密码
  bindblurPassword: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  // 获取输入验证码
  bindblurCode: function (e) {
    this.setData({
      code: e.detail.value
    })
  },

  // 获取验证码事件函数
  getCode:function(e){
    const self = this
    // 获取验证码
    wx.request({
      method: "POST",
      url: config.service.loginCode,
      data: {
        phone: this.data.phone,
      },
      success(res) {
        console.log(res)
        if (res.statusCode == 200) {
          if(res.data.status == 200){
            wx.showToast({
              title: config.message.M1004,
              icon: 'none'
            })
          }else{
            wx.showToast({
              title: config.message.M1005,
              icon: 'none'
            })
          }
        }
      },
      fail: function () {
        wx.showToast({
          title: config.message.A1001,
          icon: 'none'
        })
      },
      complete:function(){
        setTimeout(function(){
            wx.hideToast()
        }, config.delay)
      }
    })
  },

  bindUserInfo:function(e){
    if (!this.data.phone || !this.data.password){
      wx.showToast({
        title: config.message.M1006,
        icon: 'none'
      })
      setTimeout(function () {
        wx.hideToast()
      }, config.delay)
      return false;
    }
    
    // 绑定用户
    wx.showLoading({
      title: config.message.L1001,
    })
    wx.request({
      method: "POST",
      url: config.service.bind,
      data: {
        username: this.data.phone,
        password: this.data.password,
        openid: app.globalData.openid
      },
      success(res) {
        if (res.statusCode == 200) {
          if (res.data.status == 200) {
            wx.hideLoading()  // 隐藏londing框
            wx.showToast({
              title: config.message.M1002,
              icon: 'none'
            })
            setTimeout(function () {
              wx.hideToast()
              wx.reLaunch({
                url: '/pages/index/index'
              })
            }, config.delay)
          } else {
            wx.showToast({
              title: res.data.content,
              icon: 'none'
            })
            setTimeout(function () {
              wx.hideToast()
            }, config.delay)
          }
        }
      },
      fail: function () {
        wx.hideLoading()  // 隐藏londing框
        wx.showToast({
          title: config.message.A1001,
          icon: 'none'
        })
        setTimeout(function () {
          wx.hideToast()
        }, config.delay)
      }
    })
  }
})