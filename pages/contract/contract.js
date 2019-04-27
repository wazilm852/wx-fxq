//contact.js
var config = require('../../config.js')
var util = require('../../utils/util.js')

//获取应用实例
const app = getApp()

let count = 10
let currypage = 1

Page({

  data: {
    active: 0,
    contractlist: {
      contract: [],
      count: count,
      currypage: currypage,
      pages: 1,
      waitme: 0,
      waitother: 0
    }
  },

  onLoad: function (options) {
    wx.showLoading({
      title: config.message.L1001,
    })

    if (options.type == 0) {
      this.setData({ active: 1 })
      this.requestContractlist(this, config.service.getcontractlist, { 'Authorization': app.globalData.fxq_userInfo.token }, { userid: app.globalData.fxq_userInfo.userid, pagesize: count, type: 0 }, true)
    } else if (options.type == 1) {
      this.setData({ active: 2 })
      this.requestContractlist(this, config.service.getcontractlist, { 'Authorization': app.globalData.fxq_userInfo.token }, { userid: app.globalData.fxq_userInfo.userid, pagesize: count, type: 1 }, true)
    } else if (options.type == 2) {
      this.setData({ active: 3 })
      this.requestContractlist(this, config.service.getcontractlist, { 'Authorization': app.globalData.fxq_userInfo.token }, { userid: app.globalData.fxq_userInfo.userid, pagesize: count, type: 2 }, true)    
    }else{
      this.requestContractlist(this, config.service.getcontractlist, { 'Authorization': app.globalData.fxq_userInfo.token }, { userid: app.globalData.fxq_userInfo.userid, pagesize: count }, true)
    }
  },

  onReady: function () {

  },


  onChange(event) {
    currypage = 1 // 重置当前页数
    this.setData({
      active: event.detail.index,
      contractlist: {}
    })

    wx.showLoading({
      title: config.message.L1001,
    })
    const self = this
    if (event.detail.index == 1) { //待我签
      self.requestContractlist(self, config.service.getcontractlist, { 'Authorization': app.globalData.fxq_userInfo.token }, { userid: app.globalData.fxq_userInfo.userid, pagesize: count, type: 0 }, true)
    } else if (event.detail.index == 2) { //待他签
      self.requestContractlist(self, config.service.getcontractlist, { 'Authorization': app.globalData.fxq_userInfo.token }, { userid: app.globalData.fxq_userInfo.userid, pagesize: count, type: 1 }, true)
    } else if (event.detail.index == 3) { //已完成
      self.requestContractlist(self, config.service.getcontractlist, { 'Authorization': app.globalData.fxq_userInfo.token }, { userid: app.globalData.fxq_userInfo.userid, pagesize: count, type: 2 }, true)
    } else if (event.detail.index == 4) { //已拒绝
      self.requestContractlist2(self, config.service.getcontractlist, { 'Authorization': app.globalData.fxq_userInfo.token }, { userid: app.globalData.fxq_userInfo.userid, pagesize: count, type: 3 }, true)
    } else if (event.detail.index == 5) { //已撤回
      self.requestContractlist(self, config.service.getcontractlist, { 'Authorization': app.globalData.fxq_userInfo.token }, { userid: app.globalData.fxq_userInfo.userid, pagesize: count, type: 6 }, true)
    } else if (event.detail.index == 6) { //已过期
      self.requestContractlist(self, config.service.getcontractlist, { 'Authorization': app.globalData.fxq_userInfo.token }, { userid: app.globalData.fxq_userInfo.userid, pagesize: count, type: 7 }, true)
    } else {
      self.requestContractlist(self, config.service.getcontractlist, { 'Authorization': app.globalData.fxq_userInfo.token }, { userid: app.globalData.fxq_userInfo.userid, pagesize: count }, true)
    }
  },

  // 上拉加载
  onReachBottom: function () {
    const self = this
    currypage++

    if (currypage > this.data.contractlist.pages) {
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

      if (this.data.active == 1) {
        self.requestContractlist(self, config.service.getcontractlist, { 'Authorization': app.globalData.fxq_userInfo.token }, { userid: app.globalData.fxq_userInfo.userid, pageno: currypage, pagesize: count, type: 0 })
      } else if (this.data.active == 2) {
        self.requestContractlist(self, config.service.getcontractlist, { 'Authorization': app.globalData.fxq_userInfo.token }, { userid: app.globalData.fxq_userInfo.userid, pageno: currypage, pagesize: count, type: 1 })
      } else if (this.data.active == 3) {
        self.requestContractlist(self, config.service.getcontractlist, { 'Authorization': app.globalData.fxq_userInfo.token }, { userid: app.globalData.fxq_userInfo.userid, pageno: currypage, pagesize: count, type: 2 })
      } else if (this.data.active == 4) {
        self.requestContractlist2(self, config.service.getcontractlist, { 'Authorization': app.globalData.fxq_userInfo.token }, { userid: app.globalData.fxq_userInfo.userid, pageno: currypage, pagesize: count, type: 3 })
        // self.requestContractlist(self, config.service.getcontractlist, { 'Authorization': app.globalData.fxq_userInfo.token }, { userid: app.globalData.fxq_userInfo.userid, pageno: currypage, pagesize: count, type: 4 })
      } else if (this.data.active == 5) {
        self.requestContractlist(self, config.service.getcontractlist, { 'Authorization': app.globalData.fxq_userInfo.token }, { userid: app.globalData.fxq_userInfo.userid, pageno: currypage, pagesize: count, type: 6 })
      } else if (this.data.active == 6) {
        self.requestContractlist(self, config.service.getcontractlist, { 'Authorization': app.globalData.fxq_userInfo.token }, { userid: app.globalData.fxq_userInfo.userid, pageno: currypage, pagesize: count, type: 7 })
      } else {
        self.requestContractlist(self, config.service.getcontractlist, { 'Authorization': app.globalData.fxq_userInfo.token }, { userid: app.globalData.fxq_userInfo.userid, pageno: currypage, pagesize: count })
      }
    }
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    const self = this
    wx.showLoading({
      title: config.message.L1001,
    })

    if (this.data.active == 1) {
      self.requestContractlist(self, config.service.getcontractlist, { 'Authorization': app.globalData.fxq_userInfo.token }, { userid: app.globalData.fxq_userInfo.userid, pagesize: count, type: 0 },true)
    } else if (this.data.active == 2) {
      self.requestContractlist(self, config.service.getcontractlist, { 'Authorization': app.globalData.fxq_userInfo.token }, { userid: app.globalData.fxq_userInfo.userid, pagesize: count, type: 1 },true)
    } else if (this.data.active == 3) {
      self.requestContractlist(self, config.service.getcontractlist, { 'Authorization': app.globalData.fxq_userInfo.token }, { userid: app.globalData.fxq_userInfo.userid, pagesize: count, type: 2 },true)
    } else if (this.data.active == 4) {
      self.requestContractlist2(self, config.service.getcontractlist, { 'Authorization': app.globalData.fxq_userInfo.token }, { userid: app.globalData.fxq_userInfo.userid, pagesize: count, type: 3 },true)
    } else if (this.data.active == 5) {
      self.requestContractlist(self, config.service.getcontractlist, { 'Authorization': app.globalData.fxq_userInfo.token }, { userid: app.globalData.fxq_userInfo.userid, pagesize: count, type: 6 },true)
    } else if (this.data.active == 6) {
      self.requestContractlist(self, config.service.getcontractlist, { 'Authorization': app.globalData.fxq_userInfo.token }, { userid: app.globalData.fxq_userInfo.userid, pagesize: count, type: 7 },true)
    } else {
      self.requestContractlist(self, config.service.getcontractlist, { 'Authorization': app.globalData.fxq_userInfo.token }, { userid: app.globalData.fxq_userInfo.userid, pagesize: count },true)
    }

    wx.stopPullDownRefresh()
  },

  /**
   * 生命周期函数
   */
  onShow: function () {
    wx.showLoading({
      title: config.message.L1001,
    })

    if (this.data.active == 1) {
      this.requestContractlist(this, config.service.getcontractlist, { 'Authorization': app.globalData.fxq_userInfo.token }, { userid: app.globalData.fxq_userInfo.userid, pagesize: count, type: 0 }, true)
    } else if (this.data.active == 2) {
      this.requestContractlist(this, config.service.getcontractlist, { 'Authorization': app.globalData.fxq_userInfo.token }, { userid: app.globalData.fxq_userInfo.userid, pagesize: count, type: 1 }, true)
    } else if (this.data.active == 3) {
      this.requestContractlist(this, config.service.getcontractlist, { 'Authorization': app.globalData.fxq_userInfo.token }, { userid: app.globalData.fxq_userInfo.userid, pagesize: count, type: 2 }, true)
    } else if (this.data.active == 4) {
      this.requestContractlist2(this, config.service.getcontractlist, { 'Authorization': app.globalData.fxq_userInfo.token }, { userid: app.globalData.fxq_userInfo.userid, pagesize: count, type: 3 }, true)
    } else if (this.data.active == 5) {
      this.requestContractlist(this, config.service.getcontractlist, { 'Authorization': app.globalData.fxq_userInfo.token }, { userid: app.globalData.fxq_userInfo.userid, pagesize: count, type: 6 }, true)
    } else if (this.data.active == 6) {
      this.requestContractlist(this, config.service.getcontractlist, { 'Authorization': app.globalData.fxq_userInfo.token }, { userid: app.globalData.fxq_userInfo.userid, pagesize: count, type: 7 }, true)
    } else {
      this.requestContractlist(this, config.service.getcontractlist, { 'Authorization': app.globalData.fxq_userInfo.token }, { userid: app.globalData.fxq_userInfo.userid, pagesize: count }, true)
    }
  },

  // 合同列表
  requestContractlist: function (self, url, header, data, rewrite = false) {
    if (app.globalData.fxq_userInfo.identity == 3) {
      url = config.service.getcontractlist2
      data.companyid = app.globalData.fxq_userInfo.companyid
    } 

    wx.request({
      method: "POST",
      url: url,
      header: header,
      data: data,
      success(res) {
        if (res.statusCode == 200) {
          if (res.data.status == 200) {
            let contractlist = {}
            contractlist.contract = []
            contractlist.count = res.data.content.count
            contractlist.currypage = res.data.content.currypage
            contractlist.pages = res.data.content.pages
            contractlist.waitme = res.data.content.waitme
            contractlist.waitother = res.data.content.waitother

            // 更多数据
            if (rewrite) {  // 重写
              currypage = 1
              contractlist.contract = res.data.content.contract
            } else {  // 追加
              contractlist.contract = self.data.contractlist.contract
              if (typeof (contractlist.contract) != "undefined") {
                contractlist.contract.push(...res.data.content.contract)
              }
            }
            self.setData({ contractlist: contractlist })
            // console.log(self.data)
          }
        } else {
          wx.showToast({
            title: res.statusCode.toString(),
            icon: 'none'
          })
          setTimeout(function () {
            wx.hideToast()
          }, config.delay)
        }
        wx.hideLoading()  // 隐藏londing框
      },
      fail: function () {
        wx.hideLoading()  // 隐藏londing框
        wx.showToast({
          title: config.message.A1001,
          icon: 'none'
        })
        setTimeout(function () {
          wx.hideToast()
        }, config.delay)
      }
    })
  },

  // 已拒绝合同列表（包含我拒绝，他人拒绝）
  requestContractlist2: function (self, url, header, data, rewrite = false) {
    if (app.globalData.fxq_userInfo.identity == 3) {
      url = config.service.getcontractlist2
      data.companyid = app.globalData.fxq_userInfo.companyid
    } 
    
    wx.request({
      method: "POST",
      url: url,
      header: header,
      data: data,
      success(res) {
        if (res.statusCode == 200) {
          if (res.data.status == 200) {
            let contractlist = {}
            contractlist.contract = []
            contractlist.count = res.data.content.count
            contractlist.currypage = res.data.content.currypage
            contractlist.pages = res.data.content.pages
            contractlist.waitme = res.data.content.waitme
            contractlist.waitother = res.data.content.waitother

            // 更多数据
            if (rewrite) {  // 重写
              contractlist.contract = res.data.content.contract
            } else {  // 追加
              contractlist.contract = self.data.contractlist.contract
              if (typeof (contractlist.contract) != "undefined") {
                contractlist.contract.push(...res.data.content.contract)
              }
            }
            self.setData({ contractlist: contractlist })
            self.requestContractlist(self, config.service.getcontractlist, { 'Authorization': app.globalData.fxq_userInfo.token }, { userid: app.globalData.fxq_userInfo.userid, pagesize: count, type: 4 })
          }
        } else {
          wx.showToast({
            title: res.statusCode.toString(),
            icon: 'none'
          })
          setTimeout(function () {
            wx.hideToast()
          }, config.delay)
        }
        // wx.hideLoading()  // 隐藏londing框
      },
      fail: function () {
        wx.hideLoading()  // 隐藏londing框
        wx.showToast({
          title: config.message.A1001,
          icon: 'none'
        })
        setTimeout(function () {
          wx.hideToast()
        }, config.delay)
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
