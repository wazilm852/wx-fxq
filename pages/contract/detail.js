// pages/contract/detail.js
var config = require("../../config.js");
var http = require("../../utils/request.js");

//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    contractid:null,
    title:'合同详情',
    isRecall:false,
    isReject:false,
    content:{},
    signers:{},
    isNotice:0,
    status:0,
    pdfPath:'',
    endtime: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    const self = this

    if (options.endtime){
      this.setData({ endtime: options.endtime})
    }

    if (options.contractid){
      this.setData({ contractid: options.contractid})

      wx.showLoading({
        title: config.message.L1001,
      })

      this.getcondetail()

      if (options.pdfurl){
        wx.downloadFile({
          url: options.pdfurl.replace(/^http(s)?:\/\/(.*?)\//, config.pdfoss),
          success: function (res) {
            self.setData({
              pdfPath: res.tempFilePath
            })
          },
          fail: function (err) {
            wx.hideLoading()
            wx.showToast({
              title: err.errMsg,
              icon: 'none'
            })
            setTimeout(function () {
              wx.hideToast()
            }, config.delay)
          }
        })
      }
    }
  },

  // 合同详情
  getcondetail() {
    let url = config.service.getcondetail
    let data = {
      id: this.data.contractid,
      userid: app.globalData.fxq_userInfo.userid
    }

    if (app.globalData.fxq_userInfo.identity == 3) {
      url = config.service.getconcompanydetail
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
          data.content.contract.endtime = self.data.endtime

          // 判断标题栏名称
          let title = self.data.title
          if (data.content.contract.status == 0) {
            title = '待我签'
          } else if (data.content.contract.status == 1) {
            title = '待他签'
          } else if (data.content.contract.status == 2) {
            title = '已完成'
          } else if (data.content.contract.status == 3) {
            title = '我方拒签'
          } else if (data.content.contract.status == 4) {
            title = '他人拒签'
          } else if (data.content.contract.status == 6) {
            title = '已撤回'
          } else if (data.content.contract.status == 7) {
            title = '已过期'
          }

          // 设置标题栏名称
          wx.setNavigationBarTitle({
            title: title
          })

          self.setData({
            title: title,
            status: data.content.contract.status,
            content: data.content,
            signers: data.content.signers
          })
          console.log(self.data)
        }
        wx.hideLoading()
      })
  },

  // 打开pdf
  openpdf(e){
    wx.showLoading({
      title: config.message.L1001,
    })
    
    if (this.data.pdfPath){
      wx.openDocument({
        filePath: this.data.pdfPath,
        success: function (res) {
          wx.hideLoading()
        }
      })
    }else{
      wx.downloadFile({
        url: this.data.content.contract.pdfurl.replace(/^http(s)?:\/\/(.*?)\//, config.pdfoss),
        success: function (res) {
          // let filePath = res.tempFilePath              //返回的文件临时地址，用于后面打开本地预览所用
          wx.openDocument({
            filePath: res.tempFilePath,
            success: function (res) {
              wx.hideLoading()
            }
          })
        },
        fail: function (err) {
          wx.hideLoading()
          // 显示弹框
          wx.showToast({
            title: err.errMsg,
            icon: 'none'
          })
          setTimeout(function () {
            wx.hideToast()
          }, config.delay)
        }
      })
    }
  },

  

  // 立即签署
  startSign() {
    wx.navigateTo({
      url: '/pages/sign/sign?contractid=' + this.data.content.contract.contractid,
    })
  },

  // 撤回
  recall:function(e){
    const self = this
    
    let url = config.service.personRecall
    let data = {
      id: this.data.content.contract.contractid,
      userid: app.globalData.fxq_userInfo.userid,
      remark: ''
    }

    if (app.globalData.fxq_userInfo.identity == 3) {
      url = config.service.companyRecall
      data.companyid = app.globalData.fxq_userInfo.companyid
    }
    
    wx.showModal({
      title: '提示',
      content: config.message.M1034,
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: config.message.L1001,
          })
          wx.request({
            method: "POST",
            url: url,
            header: {
              'Authorization': app.globalData.fxq_userInfo.token
            },
            data: data,
            success(res) {
              wx.hideLoading();
              if (res.statusCode == 200) {
                if (res.data.status == 200) {
                  self.getcondetail()
                  self.setData({ isRecall: false, status: 6 })
                }
              }
            },
            fail: function (err) {
              wx.hideLoading();
              wx.showToast({
                title: err.errMsg,
                icon: 'none'
              })
              setTimeout(function () {
                wx.hideToast()
              }, config.delay)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  // 拒签
  reject: function (e) {
    const self = this

    let url = config.service.personReject
    let data = {
      id: self.data.content.contract.contractid,
      userid: app.globalData.fxq_userInfo.userid,
      remark: ''
    }

    if (app.globalData.fxq_userInfo.identity == 3) {
      url = config.service.companyReject
      data.companyid = app.globalData.fxq_userInfo.companyid
    }

    wx.showModal({
      title: '提示',
      content: config.message.M1035,
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: config.message.L1001,
          })
          wx.request({
            method: "POST",
            url: url,
            header: {
              'Authorization': app.globalData.fxq_userInfo.token
            },
            data: data,
            success(res) {
              wx.hideLoading()
              if (res.statusCode == 200) {
                if (res.data.status == 200) {
                  self.getcondetail()
                  self.setData({ isReject: false, status: 3 })
                }
              }
            },
            fail: function (err) {
              wx.hideLoading()
              wx.showToast({
                title: err.errMsg,
                icon: 'none'
              })
              setTimeout(function () {
                wx.hideToast()
              }, config.delay)
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 一键提醒所有未签署的用户
   */
  remindAll: function ()
  {
    const self = this;
    
    if (Date.parse(new Date()) < self.data.content.contract.createdAt + 10*60*1000){
      wx.showToast({
        title: config.message.M1039,
        icon: 'none'
      })
      return false
    }

    let url = config.service.personRemindAll
    let data = {
      contractid: self.data.content.contract.contractid,
      userid: app.globalData.fxq_userInfo.userid
    }

    if (app.globalData.fxq_userInfo.identity == 3) {
      url = config.service.companyRemindAll
      data.companyid = app.globalData.fxq_userInfo.companyid
    }
    
    let header = {
      'Authorization': app.globalData.fxq_userInfo.token
    };

    wx.request({
      method: 'POST',
      url: url,
      header: header,
      data: data,
      success: function (res){
        console.log(res);
        self.setData({
          isNotice:1
        })
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
  // 下拉刷新
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