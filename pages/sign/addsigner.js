// pages/sign/addsigner.js
var config = require('../../config.js')
var http = require('../../utils/request.js')
var regex = require('../../utils/regex.js')

//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    group: [],
    gid: null, // 分组id
    phone: null,
    name: null,
    id: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 查询分组
    let url = config.service.queryGroup
    let data = {
      userid: app.globalData.fxq_userInfo.userid
    }

    if (app.globalData.fxq_userInfo.identity == 3) {
      url = config.service.queryGroup2
      data.companyid = app.globalData.fxq_userInfo.companyid
    }

    http.request(this, url, {
      'Authorization': app.globalData.fxq_userInfo.token
    }, data, function (self, data) {
      self.setData({
        group: data.content,
        gid: data.content[0].id
      })
    })

    this.setData({
      gid: options.gid ? options.gid : this.data.gid,
      id: options.id ? options.id : null,
      name: options.nickname ? options.nickname : null,
      phone: options.phone ? options.phone : null,
    })

  },
  // 获取输入手机号
  bindblurPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  // 获取输入姓名
  bindblurName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  // 添加签署人
  addSigner(e) {
    if (this.data.phone == null || this.data.name == null) {
      wx.showToast({
        title: config.message.M1040,
        icon: 'none',
        duration: 1000,
        mask: true
      })
    } else if (regex.phone.test(this.data.phone)) {
      let url = config.service.addLinkMan
      let data = {
        gid: this.data.gid,
        email: this.data.phone,
        phone: this.data.phone,
        name: this.data.name,
        userid: app.globalData.fxq_userInfo.userid
      }

      if (app.globalData.fxq_userInfo.identity == 3) {
        url = config.service.addLinkMan2
        data.companyid = app.globalData.fxq_userInfo.companyid
        data.groupid = this.data.gid

        if (data.phone.match(/\@/)) {
          data.phone = ''
        } else {
          data.email = ''
        }
      }

      http.request(this,
        url, {
          'Authorization': app.globalData.fxq_userInfo.token
        }, data,
        function (self, data) {
          if (data.status == 200) {
            let isSignUser = false
            let signUser = wx.getStorageSync('signUser')
            if (signUser.length > 0) {
              // 重复添加判断
              signUser.forEach(function (v, i, signUser) {
                if (data.content.id == v.id) {
                  isSignUser = true
                }
              })
            }

            if (!isSignUser) {
              signUser.push(data.content)
            }

            wx.setStorageSync('signUser', signUser)

            if (!self.data.id) {
              wx.navigateBack({
                delta: 1
              })
            } else {
              wx.navigateBack({
                delta: 2
              })
            }
          }
        })
    } else {
      wx.showToast({
        title: config.message.M1038,
        icon: 'none',
        duration: 1000,
        mask: true
      })
    }
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