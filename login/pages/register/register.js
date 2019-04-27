// pages/register/register.js
var config = require('../../../config.js')

//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    iscode: null,//用于存放验证码接口里获取到的code
    codename: '获取验证码',
    username: null,
    password: null,
    code: null
  },
  sendCode: function () {
      var num = 61;
      var _this = this;
      var timer = setInterval(function () {
        num--;
        if (num <= 0) {
          clearInterval(timer);
          _this.setData({
            codename: '重新发送',
            disabled: false
          })

        } else {
          _this.setData({
            codename: num + "s"
          })
        }
      },1000)
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
  getCode: function (e) {
    var _this = this;
    // 获取验证码
    wx.request({
      method: "POST",
      url: config.service.getcode,
      data: {
        username: this.data.phone,
      },
      success(res) {
        if (res.statusCode == 200) {
          if (res.data.status == 200) {
            wx.showToast({
              title: config.message.M1004,
              icon: 'none'
            })
            _this.sendCode();
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
        }
        console.log(res)
      },
      fail: function () {
        wx.showToast({
          title: config.message.A1001,
          icon: 'none'
        })
      },
      complete: function () {
        setTimeout(function () {
          wx.hideToast()
        }, config.delay)
      }
    })
  },

  // 注册用户
  bindRegisterUser: function (e) {
    const self = this
    if (!this.data.phone || !this.data.password) {
      wx.showToast({
        title: config.message.M1006,
        icon: 'none'
      })
      setTimeout(function () {
        wx.hideToast()
      }, config.delay)
      return false;
    }

    // 是否注册
    wx.request({
      method: "POST",
      url: config.service.isRegister,
      data: {
        username: this.data.phone,
      },
      success(res) {
        console.log(res)
        if (res.statusCode == 200) {
          if (res.data.status == 200) {
            // 未注册
            wx.request({
              method: "POST",
              url: config.service.register,
              data: {
                username: self.data.phone,
                password: self.data.password,
                code: self.data.code,
                openid: app.globalData.openid
              },
              success(res) {
                console.log(res)
                if (res.statusCode == 200) {
                  if (res.data.status == 200) {
                    // 注册成功
                    wx.showToast({
                      title: config.message.M1003,
                      icon: 'none'
                    })
                    setTimeout(function () {
                      wx.hideToast()
                      wx.reLaunch({
                        url: '/pages/index/index'
                      })
                    }, config.delay)
                  } else {
                    // 注册失败
                    wx.showToast({
                      title: res.data.message,
                      icon: 'none'
                    })
                    setTimeout(function () {
                      wx.hideToast()
                    }, config.delay)
                  }
                }
              },
              fail: function () {
                wx.showToast({
                  title: config.message.A1001,
                  icon: 'none'
                })
                setTimeout(function () {
                  wx.hideToast()
                }, config.delay)
              }
            })
          } else {
            // 已注册
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
            setTimeout(function () {
              wx.hideToast()
            }, config.delay)
          }
        }
      },
      fail: function () {
        wx.showToast({
          title: config.message.A1001,
          icon: 'none'
        })
        setTimeout(function () {
          wx.hideToast()
        }, config.delay)
      }
    })
  },
})