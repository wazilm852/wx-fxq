//添加联系人

//获取应用实例
var app = getApp();

var config = require('../../../config.js');
var util = require('../../../utils/util.js');
var http = require('../../../utils/request.js');
var regex = require('../../../utils/regex.js')
Page({
  data: {
    show: false,
    focus: true,
    account: null,
    alias: null,
    gid: 0
  },

  open() {
    this.setData({
      show: true
    });
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  onLoad: function() {
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
    }, data, function(self, data) {
      self.setData({
        gid: data.content[0].id
      })
    })
  },

  /**
   * 获取输入框内容,点击提交按钮添加联系人
   */
  addContacter: function() {
    var self = this;
    var name = self.data.alias;
    var phone = self.data.account;
    var email = self.data.account;

    var data = {
      groupid: this.data.gid,
      name: name,
      phone: phone,
      email: '',
      userid: app.globalData.fxq_userInfo.userid
    };
    // console.log(data);
    var header = {
      'Authorization': app.globalData.fxq_userInfo.token
    };
    var url = config.service.addLinkMan;

    if (app.globalData.fxq_userInfo.identity == 3) {
      url = config.service.addLinkMan2
      data.companyid = app.globalData.fxq_userInfo.companyid
      // if (data.phone.match(/\@/)) {
      //   data.phone = ''
      // } else {
      //   data.email = ''
      // }
    }
    if (this.data.account == '' || this.data.alias == '') {
      wx.showToast({
        title: config.message.M1040,
        icon: 'none',
        duration: 1000,
        mask: true
      })
    } else if (regex.phone.test(this.data.account)) {
      wx.request({
        method: "POST",
        url: url,
        header: header,
        data: data,
        success: function(res) {
          wx.showToast({
            title: config.message.M1015,
              icon: 'none'
            }),
            setTimeout(function() {
              wx.hideToast();
              wx.navigateBack({
                delta: 1
              })
            }, config.delay)
        },
        fail: function(res) {
          wx.showToast({
            title: config.message.M1016,
            icon: 'none'
          })
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
   * 获取账号
   */
  getAccount: function(e) {
      this.setData({
        account: e.detail.value
      })
  },

  /**
   * 获取备注
   */
  getAlias: function(e) {
    this.setData({
      alias: e.detail.value
    })
  }

})