var config = require("../../../config.js");
var http = require("../../../utils/request.js");

//获取应用实例
const app = getApp()


Page({
  data: {
    show: false,
    focus: true,
    identity:0,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    username: '',
    phone: null,
    email: null,
    identityCode: null,
    headportrait: null,
    company:null
  },

  open(){
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  onLoad: function () {
    const self = this;
    
    if (app.globalData.userInfo && app.globalData.fxq_userInfo){
      this.setData({
        username: app.globalData.fxq_userInfo.username || app.globalData.userInfo.nickName,
        phone: app.globalData.fxq_userInfo.phone,
        email: app.globalData.fxq_userInfo.email || '',
        identity: app.globalData.fxq_userInfo.identity,
      })
    }

    if(this.data.identity == 3){
      self.queryUserDetail()
    } else if (this.data.identity == 1){
      self.getAccountInfo()
    }
    
  },

/**
 * 获取用户信息
 */
  getAccountInfo: function() {
    const self = this;

    var userid = app.globalData.fxq_userInfo.userid;
    var data = {userid: userid};
    var header = { 'Authorization': app.globalData.fxq_userInfo.token };
    var url = config.service.getAccountInfo;

    wx.request({
      method: "POST",
      url: url,
      header: header,
      data: data,
      success: function (res) {
        console.log(res)
        self.setData({
          identityCode: res.data.content.identitycode,
          email: res.data.content.email ? res.data.content.email : null,
          headportrait: res.data.content.headportrait
        })
      }
    })
  },

  /**
 * 获取企业用户信息
 */
  queryUserDetail: function () {
    const self = this;

    var userid = app.globalData.fxq_userInfo.userid;
    var data = { userid: userid, companyid: app.globalData.fxq_userInfo.companyid};
    var header = { 'Authorization': app.globalData.fxq_userInfo.token };
    var url = config.service.queryUserDetail;

    wx.request({
      method: "POST",
      url: url,
      header: header,
      data: data,
      success: function (res) {
        console.log(res)
        self.setData({
          company: res.data.content.username,
          email: res.data.content.email ? res.data.content.email : null,
          headportrait: res.data.content.headportrait
        })
      }
    })
  },

  // 转发分享
  onShareAppMessage(res) {
    return {
      title: '放心签电子合同，随时随地放心签署。',
      path: '/pages/index/index',
      imageUrl: '/image/share.jpg',
      success: function (res) {
        console.log('转发成功');
      },
      fail: function (res) {
        console.log('转发失败');
      }
    }
  },
})
