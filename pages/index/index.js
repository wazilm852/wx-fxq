//index.js
var config = require('../../config.js')
var http = require('../../utils/request.js')

//获取应用实例
const app = getApp()

let count = 15
let currypage = 1

Page({
  
  data: {
    userInfo: {},
    hasFxqUserInfo: false,
    identity:0,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    mybalance:[],
    waitmeNO: 0,
    waitotherNO: 0,
    completeNO: 0,
    contractlist: {
      contract: [],
      count: count,
      currypage: currypage,
      pages: 1,
      waitme: 0,
      waitother: 0
    },
    show:false,
    bannerSrc:'/image/home-icon.png'
  },
  
  onLoad: function () {

    // 授权登录后，更新data绑定数据
    if (app.globalData.userInfo) {  // 重新加载页面调用（绑定，注册跳转）
      // 用户登录验证（重载首页）
      if (app.globalData.fxq_userInfo){
        // 动态绑定首页数据，显示授权首页
        this.setData({
          hasFxqUserInfo: true,
          identity: app.globalData.fxq_userInfo.identity
        })
      }else{
        wx.showLoading({
          title: config.message.L1001,
        })

        http.request(this,
          config.service.login,
          {
            'content-type': 'application/json'
          },
          {
            headimgurl: app.globalData.userInfo.avatarUrl,
            city: app.globalData.userInfo.city,
            country: app.globalData.userInfo.country,
            language: app.globalData.userInfo.language,
            nickname: app.globalData.userInfo.nickName,
            province: app.globalData.userInfo.province,
            sex: app.globalData.userInfo.gender,
            openid: app.globalData.openid
          },
          function (self, data) {
            if (data.status == 200) {
              // 动态绑定首页数据，显示授权首页
              self.setData({
                hasFxqUserInfo: true,
                identity: data.content.identity
              })
              wx.showTabBar() // 授权登录成功显示菜单栏

              app.globalData.fxq_userInfo = data.content  // 已绑定账户，设置全局变量用户信息（重载首页需要重新设置）
              wx.setStorageSync('fxq_userInfo', data.content)   // 已绑定账户，缓存用户信息

              // 合同数量
              self.getcontracts(0)
              self.getcontracts(1)
              self.getcontracts(2)

              // 合同列表
              self.getcontractsList(currypage, 1, 0)
            } else if (data.status == 30) {
              // 未绑定账户，跳转到绑定页面
              wx.redirectTo({
                url: '/login/pages/bind/bindone'
              })
            }
            wx.hideLoading()
          })
      }
      wx.showTabBar() // 授权登录成功显示菜单栏
    } else if (this.data.canIUse) { // 首次注册页面调用
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      // fxq_userInfo全局变量callback回调函数,登录成功后访问首页才请求数据
      app.fxquserInfoReadyCallback = res => {
        // 动态绑定首页数据，显示授权首页
        this.setData({
          hasFxqUserInfo: true,
          identity: res.identity
        })
        // 已授权，显示菜单栏
        wx.showTabBar()
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },

  // 点击授权登录获取头像昵称事件函数
  getUserInfo: function (e) {    
    if (e.detail.errMsg == 'getUserInfo:ok') {
      wx.showLoading({
        title: config.message.L1001,
      })

      // 设置全局微信用户信息
      app.globalData.userInfo = e.detail.userInfo

      // 用户登录验证
      http.request(this,
        config.service.login,
        {
          'content-type': 'application/json'
        },
        {
          headimgurl: e.detail.userInfo.avatarUrl,
          city: e.detail.userInfo.city,
          country: e.detail.userInfo.country,
          language: e.detail.userInfo.language,
          nickname: e.detail.userInfo.nickName,
          province: e.detail.userInfo.province,
          sex: e.detail.userInfo.gender,
          openid: app.globalData.openid
        },
        function (self, data) {
          if (data.status == 200) {
            app.globalData.fxq_userInfo = data.content  // 已绑定账户，设置全局变量用户信息
            wx.setStorageSync('fxq_userInfo', data.content)   // 已绑定账户，缓存用户信息

            self.mybalance()  // 查询余额
            
            // 动态绑定首页数据，显示授权首页
            self.setData({
              hasFxqUserInfo: true,
              identity: data.content.identity
            })

            // 合同数量
            self.getcontracts(0)
            self.getcontracts(1)
            self.getcontracts(2)

            // 合同列表
            self.getcontractsList(currypage, 1, 0)
            
            wx.showTabBar() // 授权登录成功显示菜单栏
          } else if (data.status == 30) {
            // 未绑定账户，跳转到绑定页面
            wx.redirectTo({
              url: '/login/pages/bind/bindone'
            })
          }
          wx.hideLoading()
        })
    }
  },

  // muliteUpload(path,n){
  //   http.upload(this,
  //     config.service.uploadImgs,
  //     path,
  //     'file[]',
  //     {
  //       'Authorization': app.globalData.fxq_userInfo.token
  //     }, {
  //       'userid': app.globalData.fxq_userInfo.userid
  //     },
  //     function (self, data) {
  //       if (data.status == 200) {

  //       }
  //       wx.hideLoading()
  //     }
  //   )
  // },

  // 图片签署
  albumSign(e) {
    const self = this
    const count = 9
    wx.chooseImage({
      count: count,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success(res) {
        wx.setStorageSync('albumSign', res.tempFilePaths)
        wx.navigateTo({
          url: '/pages/sign/signer?filePath=' + res.tempFilePaths[0],
        })
      },
      fail: function (err) {
        wx.hideLoading()
      }
    })
  },

  // 拍照签署
  cameraSign(e) {
    const self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success(res) {
        wx.navigateTo({
          url: '/pages/sign/signer?filePath=' + res.tempFilePaths[0],
        })
      },
      fail: function (err) {
        wx.hideLoading()
      }
    })
  },

  // 查询余额
  mybalance(){
    let url = config.service.mybalance
    let data = {
      userid: app.globalData.fxq_userInfo.userid
    }

    if (app.globalData.fxq_userInfo.identity == 3) {
      let url = config.service.mybalance2
      let data = {
        companyid: app.globalData.fxq_userInfo.companyid,
        userid: app.globalData.fxq_userInfo.userid
      }
    }

    http.request(this,
      url,
      {
        'Authorization': app.globalData.fxq_userInfo.token
      },
      data,
      function (self, data) {
        if (data.status == 200) {
          if ((app.globalData.fxq_userInfo.identity == 1 || app.globalData.fxq_userInfo.identity == 3) && data.content.balance <= 0 && data.content.freetime <=0){
            self.setData({
              show: true
            })
          }
        }
      })
  },

  
  identifyCompany(e){
    wx.showToast({
      title: '企业版认证，请去放心签官网完成！',
      icon: 'none',
      duration: 1000,
      mask: true
    })
  },

  go(e){
    this.setData({
      show: false
    })
  },

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

  onShow:function(){
    currypage = 1 // 重置当前页数
    if (app.globalData.fxq_userInfo){
      // 认证成功，修改认证状态
      this.setData({
        identity: app.globalData.fxq_userInfo.identity,
        username: app.globalData.fxq_userInfo.username,
      })


      wx.showLoading({
        title: config.message.L1001,
      })

      // 合同数量
      this.getcontracts(0)
      this.getcontracts(1)
      this.getcontracts(2)

      // 合同列表
      let rewrite = currypage == 1 ? true : false
      this.getcontractsList(currypage, 1, 0, rewrite)
    }
  },

  // 上拉加载
  onReachBottom: function () {

  },

  // 获取合同数量
  getcontracts(type){
    let url = config.service.getcontractlist
    let data = { userid: app.globalData.fxq_userInfo.userid, type: type }
    if (app.globalData.fxq_userInfo.identity == 3) {
      url = config.service.getcontractlist2
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
          if (type == 0){
            self.setData({
              waitmeNO: data.content.count
            })
          } else if (type == 1){
            self.setData({
              waitotherNO: data.content.count
            })
          } else if (type == 2){
            self.setData({
              completeNO: data.content.count
            })
          }
        }
        // wx.hideLoading()
      })
  },

  // 获取合同列表
  getcontractsList: function (pageno, pagesize, type, rewrite = false) {
    let url = config.service.getcontractlist
    let data = { userid: app.globalData.fxq_userInfo.userid, pageno: pageno, pagesize: pagesize, type:type }
    if (app.globalData.fxq_userInfo.identity == 3) {
      url = config.service.getcontractlist2
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
          let contractlist = {}
          contractlist.contract = []
          contractlist.count = data.content.count
          contractlist.currypage = data.content.currypage
          contractlist.pages = data.content.pages
          contractlist.waitme = data.content.waitme
          contractlist.waitother = data.content.waitother

          if (rewrite) {  // 重写
            contractlist.contract = data.content.contract
          } else {  // 追加
            contractlist.contract = self.data.contractlist.contract
            if (typeof (contractlist.contract) != "undefined") {
              contractlist.contract.push(...data.content.contract)
            }
          }

          // 递归判断无带我签合同，则显示待他签合同
          if (!data.content.contract.length && !type){
            self.getcontractsList(pageno, pagesize, 1)
          }
          
          self.setData({
            contractlist: contractlist
          })
        } else {
          wx.showToast({
            title: data.message,
            icon: 'none'
          })
        }
        wx.hideLoading()  // 隐藏londing框
      })
  },

  opentoast() {
    wx.showToast({
      title: '企业版认证，请去放心签官网完成！',
      icon: 'none',
      duration: 1000,
      mask: true
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
