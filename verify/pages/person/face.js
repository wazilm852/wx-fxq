// pages/verify/person/face.js
var config = require('../../../config.js')
var http = require('../../../utils/request.js')

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    position: 'front',
    src:'',
    name:'',
    identity:'',
    show: false, //弹出认证成功弹窗
    time: 3 //定时器
  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(!options.name){
      wx.showToast({
        title: config.message.L1003,
        icon: 'none'
      })
      return false
    }

    if (!options.identity) {
      wx.showToast({
        title: config.message.L1003,
        icon: 'none'
      })
      return false
    }

    this.setData({
      name: options.name,
      identity: options.identity
    })
  },

  // 拍照
  takePhoto() {
    let ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'low',
      success: (res) => {
        this.setData({
          src: res.tempImagePath
        })

        wx.setNavigationBarTitle({
          title: '预览'
        })
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },

  error(e) {
    wx.navigateBack({
      delta: 1
    })
    console.log(e.detail)
  },
  
  // 认证
  identifyFace() {
    const self = this
    wx.showLoading({
      title: config.message.L1001,
    })

    http.upload(this,
      config.service.identifyCheck,
      this.data.src,
      'file',
      { 'Authorization': app.globalData.fxq_userInfo.token},
      {
        name: this.data.name,
        identityCode: this.data.identity,
        // faceBase64: res.data,
        userid: app.globalData.fxq_userInfo.userid
      },
      function(self,data){
        if (data.code == '10000') {
          if (data.data.score > 0.66) {
            self.setData({ show: true })

            // 修改用户认证状态
            app.globalData.fxq_userInfo.identity = 1
            wx.setStorageSync('fxq_userInfo', app.globalData.fxq_userInfo)
          } else {
            wx.showToast({
              title: config.message.M1031,
              icon: 'none'
            })
          }
        } else {
          wx.showToast({
            title: data.message,
            icon: 'none'
          })
        }
        wx.hideLoading()
      }
    )
  },

  /**
 * 获取用户信息
 */
  getAccountInfo: function () {
    const self = this;

    var userid = app.globalData.fxq_userInfo.userid;
    var data = { userid: userid };
    var header = { 'Authorization': app.globalData.fxq_userInfo.token };
    var url = config.service.getAccountInfo;

    wx.request({
      method: "POST",
      url: config.service.getAccountInfo,
      header: { 'Authorization': app.globalData.fxq_userInfo.token },
      data: { userid: app.globalData.fxq_userInfo.userid },
      success: function (res) {
        
      }
    })
  },

  //重新拍摄
  cancel(e){
    wx.setNavigationBarTitle({
      title: '人脸识别'
    })
    this.setData({src:''})
  },

  go(e){
    this.setData({
      show: false
    })
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  //关闭弹窗，同时请关闭定时器
  close() {
    this.setData({
      show: false
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