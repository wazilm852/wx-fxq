//获取应用用户

const app = getApp();

var config = require("../../config.js");

Page({

  data:{
    status: null,
    headportrait: null,
    checkstatus: null,
    phone: '',
    email: '',
    nickname: '',
    head: null,
    identity: 0
  },
  open() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
  onLoad: function () {
    const self = this;
    if (app.globalData.userInfo && app.globalData.fxq_userInfo) {
      this.setData({
        username: app.globalData.fxq_userInfo.username,
        nickname: app.globalData.userInfo.nickName,
        phone: app.globalData.fxq_userInfo.phone,
        email: app.globalData.fxq_userInfo.email || '',
        identity: app.globalData.fxq_userInfo.identity,
        head: app.globalData.userInfo.avatarUrl
      })
    }

  },

});