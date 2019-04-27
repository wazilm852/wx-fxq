// pages/center/signature/signature.js
const app = getApp();

var config = require("../../../config.js");
var until = require("../../../utils/util.js");
var http = require('../../../utils/request.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    signature: [],
    actions: [{
        name: '手绘签章',
        id:0
      },
      {
        name: '自制签章',
        is:1
      }
    ],
    identity: 0,
    title: ' ',
    status: 0,
    show: false,
    scrollTop:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.setData({
      identity: app.globalData.fxq_userInfo.identity
    })

  },

  scroll:function(e){
    this.setData({
      scrollTop: e.detail.scrollTop
    })
  },

  /**
   * 请求签章列表
   */
  getSignatureList: function() {
    const self = this;
    wx.showLoading({
      title: config.message.L1001,
    })

    var url = config.service.getsigns;
    var header = {
      'Authorization': app.globalData.fxq_userInfo.token
    };
    var token = app.globalData.fxq_userInfo.token;
    var userid = app.globalData.fxq_userInfo.userid;

    var data = {
      userid: userid,
      token: token
    };

    if (app.globalData.fxq_userInfo.identity == 3) {
      url = config.service.getcompanysigns
      data.companyid = app.globalData.fxq_userInfo.companyid
    }

    wx.request({
      method: "POST",
      url: url,
      header: header,
      data: data,
      success: function(res) {
        let signature = res.data.content.signImgs
        if (app.globalData.fxq_userInfo.identity == 3) {
          signature = res.data.content
        }

        signature.reverse()
        self.setData({
          signature: signature
        })
        
        wx.hideLoading()
      }
    })
  },


  /**
   * 设为默认签名
   */
  setDefault: function(e) {
    const self = this;
    var url = config.service.updatedefault;
    var header = {
      'Authorization': app.globalData.fxq_userInfo.token
    };
    var userid = app.globalData.fxq_userInfo.userid;
    var signatureid = e.currentTarget.id;
    var data = {
      userid: userid,
      id: signatureid
    }

    if (app.globalData.fxq_userInfo.identity == 3) {
      url = config.service.setCompanyDefaultSign
      data.companyid = app.globalData.fxq_userInfo.companyid
    }

    wx.request({
      method: "POST",
      url: url,
      header: header,
      data: data,
      success: function(res) {
        if (res.data.status == 200) {
          self.getSignatureList()
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      }
    })
  },

  /**
   * 删除签章
   */
  deleteSignature: function(e) {
    const self = this;
    var url = config.service.deleteSignature;
    var header = {
      'Authorization': app.globalData.fxq_userInfo.token
    };

    var id = e.currentTarget.id;
    var userid = app.globalData.fxq_userInfo.userid;
    var data = {
      id: id,
      userid: userid
    };

    if (app.globalData.fxq_userInfo.identity == 3) {
      url = config.service.deletecompanysign
      data.companyid = app.globalData.fxq_userInfo.companyid
    }

    var isused = e.currentTarget.dataset.name;
    if (isused == 1) {
      wx.showToast({
        title: config.message.M1023,
        icon: 'none'
      })
    } else {
      wx.request({
        method: "POST",
        url: url,
        header: header,
        data: data,
        success: function(res) {
          if(res.data.status == 200){
            self.getSignatureList()
          }else{
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
          }
        }
      })
    }

  },

  // 添加签章
  addSign(e) {
    if (app.globalData.fxq_userInfo.identity == 0 || app.globalData.fxq_userInfo.identity == 4) {
      wx.showToast({
        title: config.message.M1028,
        icon: 'none'
      })
      setTimeout(function () {
        wx.hideToast()
      }, config.delay)

      return false
    }

    let actions = this.data.actions
    if (app.globalData.fxq_userInfo.identity == 3){
      actions.forEach(function (v, i, actions) {
        if(v.name == '手绘签章'){
          v.name = '上传签章'
        }
      })
    }
    
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    this.setData({
      show: true,
      actions:actions,
      scrollTop:0
    })
  },

  // 选择签章
  onSelect(e) {
    if(e.detail.id == 0){
      if (app.globalData.fxq_userInfo.identity == 1) {
        wx.navigateTo({
          url: '/pages/draw/draw',
        })
      }else{
        this.uploadSign()
      }
    }else{
      wx.navigateTo({
        url: '/pages/center/signature/add',
      })
    }
    
    this.setData({ show: false });
  },

  onClose() {
    this.setData({ show: false });
  },

  // 上传签章
  uploadSign() {
    const self = this

    wx.showLoading({
      title: config.message.L1001,
    })

    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // 上传签章图片
        http.upload(self,
          config.service.uploadphoto,
          res.tempFilePaths[0],
          'file', {
            'Authorization': app.globalData.fxq_userInfo.token
          }, {},
          function (self, data) {
            if (data.status == 200) {
              let signUrl = data.content
              // 添加签章
              http.request(self,
                config.service.addcompanysign, {
                  'Authorization': app.globalData.fxq_userInfo.token
                }, {
                  title: self.data.title,
                  url: signUrl,
                  status: self.data.status,
                  companyid: app.globalData.fxq_userInfo.companyid,
                  userid: app.globalData.fxq_userInfo.userid
                },
                function (self, data) {
                  if (data.status == 200) {
                    wx.showToast({
                      title: config.message.M1030,
                      icon: 'success'
                    })
                    let signature = self.data.signature
                    signature.push(data.content)
                    self.setData({
                      signature: signature
                    })
                  }
                  wx.hideLoading()
                })
            }

          }
        )
      },
      fail: function (err) {
        wx.hideLoading()
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 0
    })
    this.getSignatureList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})