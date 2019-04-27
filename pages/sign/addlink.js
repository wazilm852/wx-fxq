//联系人列表

//获取应用实例
const app = getApp();

var config = require('../../config.js');
var util = require('../../utils/util.js')
var http = require('../../utils/request.js')

let count = 15
let currypage = 1

Page({
  data: {
    show: false,
    focus: true,
    contacter: [],
    sum:0
  },

  open() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  onLoad: function () {
    
  },

  onShow: function () {
    currypage = 1
    var self = this;

    self.getContacter();

    if (app.globalData.userInfo && app.globalData.fxq_userInfo) {
      this.setData({
        username: app.globalData.fxq_userInfo.username || app.globalData.userInfo.nickName,
        phone: app.globalData.fxq_userInfo.phone,
        identity: app.globalData.fxq_userInfo.identity,
      })
    }
  },

  /**
   * 获取当前用户的联系人
   */
  getContacter: function () {
    const self = this;
    var info = app.globalData.fxq_userInfo; //用户信息
    var token = info.token; //用户token
    var userid = info.userid; //用户id
    // var currpage = 1; //当前页
    // var pagesize = 10; //每页显示条数

    var data = {
      // currpage: currpage,
      pagesize: count,
      userid: userid,
      token: token
    };
    var url = config.service.linkmanpage;
    var header = { 'Authorization': app.globalData.fxq_userInfo.token };

    if (app.globalData.fxq_userInfo.identity == 3) {
      url = config.service.linkmanpage2
      data.companyid = app.globalData.fxq_userInfo.companyid
    }


    wx.request({
      method: "POST",
      url: url,
      header: header,
      data: data,
      success: function (res) {
        if (res.data.status == 200) {
          self.setData({
            contacter: res.data.content.list,
            sum:res.data.content.sum
          })
        }
        else {
          self.setData({
            contacter: []
          })
        }
      },
    })
  },

  // 上拉加载
  onReachBottom: function () {
    const self = this
    currypage++

    if (currypage > Math.ceil(this.data.sum / count)) {
      wx.showToast({
        title: config.message.L1002,
        icon: 'none'
      })
      setTimeout(function () {
        wx.hideToast()
      }, config.delay)
    } else {
      wx.showLoading({
        title: config.message.L1001,
      })

      let url = config.service.linkmanpage
      let data = {
        userid: app.globalData.fxq_userInfo.userid,
        currpage: currypage,
        pagesize: count,
      }

      if (app.globalData.fxq_userInfo.identity == 3) {
        url = config.service.linkmanpage2
        data.companyid = app.globalData.fxq_userInfo.companyid
      }

      http.request(this,
        url, {
          'Authorization': app.globalData.fxq_userInfo.token
        }, data,
        function (self, data) {
          if (data.status == 200) {
            let contacter = self.data.contacter
            contacter.push(...data.content.list)
            self.setData({
              contacter: contacter
            })
          }
          wx.hideLoading()
        })
    }
  },
})