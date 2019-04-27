//app.js
var config = require('./config')

App({
  // 设置全局变量
  globalData: {
    openid: null,
    userInfo: null,
    fxq_userInfo: null,
    systemInfo:null
  },

  onLaunch: function () {
    const self = this
    // 默认隐藏菜单栏
    wx.hideTabBar()
    // 获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        wx.setStorageSync('systemInfo', res)
        self.globalData.systemInfo = res
      }
    })


    // 微信授权登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          method: "POST",
          url: config.service.getOpenid,  // 调用 code2Session 接口，换取 用户唯一标识 OpenID 和 会话密钥 session_key
          data: {
            appid: config.appid,
            secret: config.secret,
            js_code: res.code,
            grant_type: 'authorization_code'
          },
          success(res) {
            if (res.statusCode == 200) {
              // 登录成功，保存openID
              self.globalData.openid = res.data.openid  // 在wx.request()方法的success函数中无法使用this来保存/获取全局变量
            }else{
              wx.showToast({
                title: res.statusCode.toString(),
                icon: 'none'
              })
            }
            // console.log(res)
          },
          fail: function (e) {
            console.log(e)
            wx.showToast({
              title: config.message.A1001,
              icon: 'none'
            })
          },
          complete:function(e){
            setTimeout(function () {
              wx.hideToast()
            }, 1500)
          }
        })
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        // console.log(res, this.globalData)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            withCredentials: true,
            success: res => {
              
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              // if (this.userInfoReadyCallback) {
              //   this.userInfoReadyCallback(res)
              // }
              
              // 判断用户缓存数据是否存在
              let fxq_userInfo = wx.getStorageSync('fxq_userInfo')
              if (fxq_userInfo){
                this.globalData.fxq_userInfo = fxq_userInfo  // 缓存数据存在，重新绑定全局变量用户信息
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.fxquserInfoReadyCallback) {
                  this.fxquserInfoReadyCallback(fxq_userInfo)
                }
              }else{
                // 已授权，登录获取token及用户信息
                if (this.globalData.openid){
                  wx.request({
                    method: "POST",
                    url: config.service.login,
                    data: {
                      avatarUrl: this.globalData.userInfo.avatarUrl,
                      city: this.globalData.userInfo.city,
                      country: this.globalData.userInfo.country,
                      language: this.globalData.userInfo.language,
                      nickName: this.globalData.userInfo.nickName,
                      province: this.globalData.userInfo.province,
                      sex: this.globalData.userInfo.gender,
                      openid: this.globalData.openid
                    },
                    success(res) {
                      if (res.statusCode == 200) {
                        if (res.data.status == 200) {
                          self.globalData.fxq_userInfo = res.data.content  // 已绑定账户，设置全局变量用户信息
                          wx.setStorageSync('fxq_userInfo', res.data.content)   // 已绑定账户，缓存用户信息
                          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                          // 所以此处加入 callback 以防止这种情况
                          if (self.fxquserInfoReadyCallback) {
                            self.fxquserInfoReadyCallback(res.data.content)
                          }
                        } else if (res.data.status == 30) {
                          // 未绑定账户，跳转到绑定页面
                          wx.redirectTo({
                            url: '/login/pages/bind/bindone'
                          })
                        }
                      } else {
                        wx.showToast({
                          title: res.statusCode.toString(),
                          icon: 'none'
                        })
                      }
                    },
                    fail: function () {
                      wx.showToast({
                        title: config.message.A1001,
                        icon: 'none'
                      })
                    },
                    complete:function(){
                      // 隐藏弹框
                      setTimeout(function () {
                        wx.hideToast()
                      }, 1500)
                    }
                  })
                }
              }
            }
          })
        }
      }
    })
  },

  onShow(options) {
    // 再次注册页面时，重新设置fxq_userInfo
    let fxq_userInfo = wx.getStorageSync('fxq_userInfo')
    if (fxq_userInfo) {
      this.globalData.fxq_userInfo = fxq_userInfo  // 缓存数据存在，重新绑定全局变量用户信息
    }
    console.log(this.globalData)
  },
})
