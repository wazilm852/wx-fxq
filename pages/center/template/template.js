// pages/center/template/template.js

var config = require('../../../config.js')
var http = require('../../../utils/request.js')

//获取应用实例
const app = getApp()

let currypage = 1

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mytempList: [],
    systempList: [],
    active:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    if (options.active){
      this.setData({
        active: options.active
      })
    }
    
    wx.showLoading({
      title: config.message.L1001,
    })

    http.request(this,
      config.service.getSystemplate,
      {
        'content-type': 'application/json'
      },
      {
        page: currypage
      },
      function (self, data) {
        if (data.status == 200) {
          // let tempList = data.slice(1,-1)
          self.setData({
            systempList: data.content
          })
        }
        wx.hideLoading()
      })

    wx.showLoading({
      title: config.message.L1001,
    })

    let url = config.service.select
    let data = {
      userid: app.globalData.fxq_userInfo.userid
    }

    if (app.globalData.fxq_userInfo.identity == 3) {
      url = config.service.select
      data.companyid = app.globalData.fxq_userInfo.companyid
    }
    
    http.request(this,
      url,
      {
        'Authorization': app.globalData.fxq_userInfo.token
      },
      data,
      function (self, data) {
        if (data.status == 200) {
          self.setData({
            mytempList: data.content
          })
        }
        wx.hideLoading()
      })
  },


  usesysTemp(e) {
    wx.showLoading({
      title: config.message.L1001,
    })

    http.request(this,
      config.service.signTemplate,
      {
        'Authorization': app.globalData.fxq_userInfo.token
      },
      {
        id: e.currentTarget.dataset.id,
        userid: app.globalData.fxq_userInfo.userid
      },
      function (self, data) {
        if (data.status == 200) {
          wx.navigateTo({
            url: '/pages/sign/signer?userContractId=' + data.content.userContractId + '&title=' + data.content.title,
          })
        }
        wx.hideLoading()
      })

  },


  useTemp(e) {
    wx.navigateTo({
      url: '/pages/center/template/edit?id=' + e.currentTarget.dataset.id+'&title=' + e.currentTarget.dataset.title,
    })

    // wx.showLoading({
    //   title: config.message.L1001,
    // })

    // let url = config.service.use
    // let data = {
    //   id: e.currentTarget.dataset.id,
    //   userid: app.globalData.fxq_userInfo.userid
    // }

    // if (app.globalData.fxq_userInfo.identity == 3) {
    //   url = config.service.use2
    //   data.companyid = app.globalData.fxq_userInfo.companyid
    // }

    // http.request(this,
    //   url,
    //   {
    //     'Authorization': app.globalData.fxq_userInfo.token
    //   },
    //   data,
    //   function (self, data) {
    //     if (data.status == 200) {
    //       // 签署自动上传生成pdf合同
    //       let url2 = config.service.sign
    //       let data2 = {
    //         id: e.currentTarget.dataset.id,
    //         title: e.currentTarget.dataset.title,
    //         doccontent: data.content,
    //         userid: app.globalData.fxq_userInfo.userid
    //       }

    //       if (app.globalData.fxq_userInfo.identity == 3) {
    //         url2 = config.service.sign2
    //         data2.companyid = app.globalData.fxq_userInfo.companyid
    //       }

    //       http.request(this,
    //         url2,
    //         {
    //           'Authorization': app.globalData.fxq_userInfo.token
    //         },
    //         data2,
    //         function (self, data) {
    //           if (data.status == 200) {
    //             wx.navigateTo({
    //               url: '/pages/sign/signer?userContractId=' + data.content.userContractId + '&title=' + data.content.title,
    //             })
    //           }
    //           wx.hideLoading()
    //         })
    //     }
    //   })
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