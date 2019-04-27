// pages/draw/draw.js

var upng = require('../../utils/UPNG.js')
var config = require('../../config.js')
var http = require('../../utils/request.js')

//获取应用实例
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    canvas: {},
    context: {},
    x: null,
    y: null,
    windowWidth: 0,
    windowHeight: 0,
    active:1,
    conform: true
  },
  clear() {
    this.context.clearRect(0, 0, this.data.windowWidth, this.data.windowHeight);
    this.context.draw()
  },
  getdrawpic() {
    const self = this
    if (!this.data.conform){
      return false
    }
    this.setData({ conform: false })

    wx.showLoading({
      title: config.message.L1001,
    })
    
    wx.canvasGetImageData({
      canvasId: 'my-canvas',
      x: 0,
      y: 0,
      width: this.data.windowWidth,
      height: this.data.windowHeight, 
      success: function (res) {
        let pngData = upng.encode([res.data.buffer],res.width, res.height)
        let bs64 = wx.arrayBufferToBase64(pngData)
        // console.log(bs64,bs64.length)
        // console.log(res,self.data)
        if (bs64.length > 188){
          // 上传手绘签名
          http.request(self,
            config.service.base64Upload1, {
              'Authorization': app.globalData.fxq_userInfo.token
            }, {
              userid: app.globalData.fxq_userInfo.userid,
              base64: bs64
            },
            function (self, data) {
              if (data.status == 200) {
                self.setData({conform:true})
                wx.setStorageSync('signImg', data.content)
                wx.navigateBack({
                  delta: 1
                })
              } else {
                wx.showToast({
                  title: config.message.E1001,
                  icon: 'none'
                })
                setTimeout(function () {
                  wx.hideToast()
                }, config.delay)
              }
              wx.hideLoading()
            })
        }else{
          wx.showToast({
            title: config.message.M1029,
            icon: 'none'
          })
          setTimeout(function () {
            wx.hideToast()
          }, config.delay)
        }
        
      }

    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorageSync('signImg', '')  // 清空上一次手绘签名数据
    if (options.active){
      this.setData({
        active: options.active
      })
    }

    // this.canvas = this.$refs.canvas;
    this.context = wx.createCanvasContext('my-canvas')
    this.setData({
      windowWidth: app.globalData.systemInfo.windowWidth,
      windowHeight: app.globalData.systemInfo.windowHeight
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  drawstart(e) {
    this.context.setLineCap('round') // 让线条圆润this.context.setLineWidth(5)
    this.context.setLineWidth(5)
    this.x = e.changedTouches[0].x
    this.y = e.changedTouches[0].y
    this.context.moveTo(this.x, this.y)
    this.context.stroke()
    // this.context.draw()
  },
  drawmove(e) {
    var X1 = e.changedTouches[0].x
    var Y1 = e.changedTouches[0].y
    this.context.moveTo(this.x, this.y)
    this.context.lineTo(X1, Y1)
    this.context.stroke()
    // this.context.moveTo(X1, Y1)
    this.x = X1
    this.y = Y1
    wx.drawCanvas({
      canvasId: 'my-canvas',
      reserve: true,
      actions: this.context.getActions() // 获取绘图动作数组
    })
  },
  drawend(e) {
    this.drawmove(e)
  },
  finish() {
    this.context.draw();
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