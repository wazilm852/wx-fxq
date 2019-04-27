//更新联系人信息
//pages/center/contact/update

const app = getApp();

var config = require("../../../config.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    phone: null,
    nickname: null,
    groupId: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      id: options.id,
      nickname: options.nickname,
      phone: options.phone,
      groupId: options.groupId
    })
  },

  /**
   * 获取联系人信息
   */
  getAlias: function (e) {
    this.setData({
      nickname: e.detail.value
    })
  },

  /**
   * 修改联系人信息
   */
  upContacter: function () {
    const self = this;
    var id = self.data.id;
    var userid = app.globalData.fxq_userInfo.userid;
    var name = self.data.nickname;
    var groupId = self.data.groupId;

    var data = {
      id: id,
      userid: userid,
      name: name,
      groupid: groupId
    };

    var url = config.service.updateLinkMan;
    var header = { 'Authorization': app.globalData.fxq_userInfo.token };

    if (app.globalData.fxq_userInfo.identity == 3) {
      url = config.service.updateLinkMan2
      data.companyid = app.globalData.fxq_userInfo.companyid
    }

    wx.request({
      method: "POST",
      url: url,
      header: header,
      data: data,
      success: function (res) {
        console.log(res);
        wx.showToast({
          title: config.message.M1025,
          icon: 'none'
        }),
        setTimeout(function () {
          wx.hideToast();
          wx.navigateBack({
            delta: 1
          })
        }, config.delay)
      }
    })
  },

  /**
   * 删除联系人
   */
  delContacter: function () {
    const self = this;
    var url = config.service.deleteLinkMan;
    var header = { 'Authorization': app.globalData.fxq_userInfo.token };

    var id = self.data.id;
    var userid = app.globalData.fxq_userInfo.userid;
    var data = {
      id: id,
      userid: userid
    };

    if (app.globalData.fxq_userInfo.identity == 3) {
      url = config.service.deleteLinkMan2
      data.companyid = app.globalData.fxq_userInfo.companyid
    }

    wx.request({
      method: "POST",
      url: url,
      header: header,
      data: data,
      success: function (res) {
        console.log(res);
        wx.showToast({
          title: config.message.M1026,
          icon: 'none'
        }),
        setTimeout(function () {
          wx.hideToast();
          wx.navigateBack({
            delta: 1
          })
        }, config.delay)
      }
    })
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