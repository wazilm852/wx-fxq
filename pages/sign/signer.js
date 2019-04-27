// pages/sign/addsigner.js
var config = require('../../config.js')
var http = require('../../utils/request.js')

//获取应用实例
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userContractId: null,
    filePath: '',
    title: '',
    deadline: '',
    type: 2, // 0:无序签 ,1:有序签 2:单独签
    signUser: [],
    firstImgs: [],
    imgs: [],
    contract: {},
    today:'',
    enddate:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 日期选择器需要提供start&end，这里start为当前日期，end为当前1012天后的日期
    var myDate = new Date();
    var myEndDate = new Date(myDate);
    myEndDate.setDate(myDate.getDate()+1012);
    this.setData({
      today: myDate.toLocaleDateString(),//获取当前时间
      enddate: myEndDate.toLocaleDateString()//获取结束时间
    })
    
    wx.setStorageSync('signUser', [])  // 清楚缓存（防止添加签署人重复）
    const self = this

    // 页面跳转参数（我的模板，添加签署人）
    if (options.userContractId) {
      this.setData({
        userContractId: options.userContractId
      })
    }

    // 页面跳转参数（模板合同标题）
    if (options.title) {
      this.setData({
        title: options.title,
      })
    }


    // 参数判断（图片合同）
    if (options.filePath) {
      let albumSign = wx.getStorageSync('albumSign')
      console.log(albumSign)

      http.upload(this,
        config.service.uploadContract,
        options.filePath,
        'file', 
        {
          'Authorization': app.globalData.fxq_userInfo.token
        }, {
          'userid': app.globalData.fxq_userInfo.userid
        },
        function(self, data) {
          if (data.status == 200) {
            self.setData({
              // title: data.content.fileInfo.userContractId, //  微信无法获取上传图片的原文件名
              filePath: options.filePath,
              userContractId: data.content.fileInfo.userContractId
            })
          }
          wx.hideLoading()
          // console.log(data)
        }
      )
    }

    if(this.data.firstImgs.length == 0){
      wx.showLoading({
        title: config.message.L1001,
      })

      // 使用websocket监听合同转换成功事件
      wx.connectSocket({
        url: config.service.convertingSocket + app.globalData.fxq_userInfo.userid
      })

      wx.onSocketOpen(function (res) {
        console.log('WebSocket 已打开！')
      })

      wx.onSocketMessage(function (res) {
        let jsonData = JSON.parse(res.data)
        if (jsonData.status == 1) {
          // 获取上传合同首页缩略图
          self.getfirstimg()
        }
        wx.closeSocket()
      })

      wx.onSocketClose(function (res) {
        wx.hideLoading()
        console.log('WebSocket 已关闭！')
      })

      wx.onSocketError(function (res) {
        wx.hideLoading()
        wx.showToast({
          title: config.message.A1002,
          icon: 'none'
        })
        setTimeout(function () {
          wx.hideToast()
        }, config.delay)
        console.log('WebSocket 错误！', res)
        // 获取上传合同首页缩略图
        self.getfirstimg()
      })
    }
    
    // console.log(this.data)
  },

  // 删除联系人
  delsignUser(e) {
    let signUser = this.data.signUser
    let signUser2 = wx.getStorageSync('signUser')
    if (signUser.length > 0 && signUser2.length > 0) {
      signUser.splice(e.currentTarget.dataset.index, 1)
      this.setData({
        signUser: signUser
      })

      // 同步删除缓存数据
      signUser2.splice(e.currentTarget.dataset.index - 1, 1)
      wx.setStorageSync('signUser', signUser2)
    }
    // console.log(wx.getStorageSync('signUser'))
  },

  // 保存签署人
  saveSignUser() {
    // 至少添加一个接收签署人
    if (this.data.signUser.length < 2) {
      wx.showToast({
        title: config.message.M1017,
        icon: 'none'
      })
      setTimeout(function() {
        wx.hideToast()
      }, config.delay)

      return false
    } else if (this.data.firstImgs.length < 1) {
      this.getfirstimg()
      wx.showToast({
        title: config.message.M1019,
        icon: 'none'
      })
      setTimeout(function() {
        wx.hideToast()
      }, config.delay)

      return false
    } else if (!this.data.title){
      wx.showToast({
        title: config.message.M1041,
        icon: 'none'
      })
      setTimeout(function () {
        wx.hideToast()
      }, config.delay)

      return false
    }

    wx.showLoading({
      title: config.message.L1001,
    })

    let url = config.service.saveSigners
    let data = {
      title: this.data.title,
      deadline: this.data.deadline,
      type: this.data.type,
      signUser: this.data.signUser,
      userid: app.globalData.fxq_userInfo.userid,
      userContractId: this.data.userContractId
    }

    if (app.globalData.fxq_userInfo.identity == 3) {
      url = config.service.saveSigners2
      data.companyid = app.globalData.fxq_userInfo.companyid
    }

    http.request(this,
      url, {
        'Authorization': app.globalData.fxq_userInfo.token
      }, data,
      function(self, data) {
        if (data.status == 200) {
          wx.navigateTo({
            url: '/pages/sign/sign?userContractId=' + self.data.userContractId,
          })
        } else {
          wx.hideLoading()
          wx.showToast({
            title: data.message,
            icon: 'none'
          })
          setTimeout(function() {
            wx.hideToast()
          }, config.delay)
        }
        wx.hideLoading()
      })
  },

  openpdf: function(e) {
    const self = this
    wx.showLoading({
      title: config.message.L1001,
    })
    // console.log(this.data)
    if (this.data.firstImgs.pdfPath) {
      wx.openDocument({
        filePath: this.data.firstImgs.pdfPath,
        success: function(res) {
          wx.hideLoading()
        }
      })
    } else {
      wx.downloadFile({
        url: this.data.firstImgs.pdfUrl.replace(/^http(s)?:\/\/(.*?)\//, config.pdfoss),
        success: function(res) {
          let pdfPath = res.tempFilePath //返回的文件临时地址，用于后面打开本地预览所用
          wx.openDocument({
            filePath: pdfPath,
            success: function(res) {
              let firstImgs = self.data.firstImgs
              firstImgs.pdfPath = pdfPath
              self.setData({
                firstImgs: firstImgs
              })
              wx.hideLoading()
            }
          })
        },
        fail: function(err) {
          wx.hideLoading()
          // 显示弹框
          wx.showToast({
            title: err.errMsg,
            icon: 'none'
          })
          setTimeout(function() {
            wx.hideToast()
          }, config.delay)
        }
      })
    }
  },

  // 合同名称
  bindTitleChange: function(e) {
    this.setData({
      title: e.detail.value
    })
  },
  // 选择日期
  bindDateChange: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      deadline: e.detail.value
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
    
    // 发起方
    let signUser = []
    let myself = {
      name: app.globalData.fxq_userInfo.username,
      phone: app.globalData.fxq_userInfo.phone,
      email: app.globalData.fxq_userInfo.email,
      identity: app.globalData.fxq_userInfo.identity,
      status: app.globalData.fxq_userInfo.status,
      userid: app.globalData.fxq_userInfo.userid,
    }

    signUser.push(myself)
    this.setData({
      signUser: signUser
    })

    // 接收方
    if (wx.getStorageSync('signUser').length > 0) {
      signUser.push(...wx.getStorageSync('signUser'))
      this.setData({
        signUser: signUser
      })
    }
    // console.log(this.data)
    // console.log(wx.getStorageSync('signUser'))
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
    // wx.setStorageSync('signUser', [])  // 清楚缓存（防止添加签署人重复）
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

  },

  getfirstimg(){
    let url = config.service.getfirstimg
    let data = {
      userid: app.globalData.fxq_userInfo.userid,
      userContractId: this.data.userContractId
    }

    if (app.globalData.fxq_userInfo.identity == 3) {
      url = config.service.getfirstimg2
      data.companyid = app.globalData.fxq_userInfo.companyid
    }

    // 获取上传合同首页缩略图
    http.request(this,
      url, 
      {
        'Authorization': app.globalData.fxq_userInfo.token
      }, 
      data,
      function (self, data) {
        if (data.status == 200) {
          self.setData({
            firstImgs: data.content,
          })
        }
      })
  }
})