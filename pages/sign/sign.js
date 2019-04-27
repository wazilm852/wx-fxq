// pages/sign/sign.js
var config = require('../../config.js')
var http = require('../../utils/request.js')

//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    x: 70, //初始位置
    y: 335, //初始位置

    showdraw: true,  // 是否显示手绘签名
    visible: true, // 是否显示签章列表
    active: 1, //当前触发页
    windowWidth: 0,
    windowHeight: 0,

    A4Width: 595.32, // A4宽
    A4Height: 841.92, // A4高
    ratio: 1.58752, // 换算比例（默认）
    documentWidth: 375, // 文档宽度（默认）
    documentHeight: 530.34, // 文档高度（默认）
    rectangleW: 80, // 签章矩形宽（默认，不包含边框）
    rectangleH: 60, // 签章矩形高（默认，不包含边框）

    userContractId: null, // 用户合同关联表id
    contractId: null, // 合同id
    balance: 0, // 用户余额
    contract: {}, // 合同信息
    imgs: [], // 图片合同（未设置签署区域）
    signers: [], // 所需签署人列表
    signImgs: [], // 签章列表
    signImgId: null, // 默认签章id(所使用的签章id)
    pdfImg: [], // 图片合同（已设置签署区域）
    contractSign: [], // 签署区域坐标
    show:false //签章列表弹出框
  },
  openlist(){
    this.setData({
      show:true
    })
  },
  onClose(){
    this.setData({
      show: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setStorageSync('signImg', '')

    wx.showLoading({
      title: config.message.L1001,
    })

    if (options.userContractId) { // 发起方签署
      let url = config.service.selectsignport
      let data = {
        userid: app.globalData.fxq_userInfo.userid,
        usercontractid: options.userContractId,
        holder: app.globalData.fxq_userInfo.userid
      }

      if (app.globalData.fxq_userInfo.identity == 3) {
        url = config.service.selectsignport2
        data.companyid = app.globalData.fxq_userInfo.companyid

        this.setData({
          showdraw: false,
        })
      }

      // 获取合同信息，图片，签署人
      http.request(this,
        url, {
          'Authorization': app.globalData.fxq_userInfo.token
        }, data,
        function (self, data) {
          if(data.status == 200){
            self.setData({
              userContractId: options.userContractId,
              contractId: data.content.contractId,
              contract: data.content.draftInfo,
              imgs: data.content.imgs,
              signers: data.content.signers
            })
            // 设置标题栏名称
            wx.setNavigationBarTitle({
              title: data.content.draftInfo.title
            })
          }

          wx.hideLoading()
        })
    } else if (options.contractid){   // 接收方签署
      let url = config.service.startSign
      let data = {
        userid: app.globalData.fxq_userInfo.userid,
        id: options.contractid
      }

      if (app.globalData.fxq_userInfo.identity == 3) {
        url = config.service.startSign2
        data.companyid = app.globalData.fxq_userInfo.companyid

        this.setData({
          showdraw: false,
        })
      }

      // 获取合同信息，图片，签署人
      http.request(this,
        url, {
          'Authorization': app.globalData.fxq_userInfo.token
        }, data,
        function (self, data) {
          if(data.status == 200){
            // 统一删除PC端发起合同默认签署区域
            data.content.pdfImg.forEach(function (v, i, imgs) {
              v.signs = []
            })

            self.setData({
              contractId: options.contractid,
              contract: data.content.contract,
              imgs: data.content.pdfImg,
              signers: [data.content.signers]
            })

            // 设置标题栏名称
            wx.setNavigationBarTitle({
              title: data.content.contract.title
            })
          }
          
          wx.hideLoading()
        })
    }
    
    // 获取用户余额
    let url2 = config.service.mybalance
    let data2 = {
      userid: app.globalData.fxq_userInfo.userid,
    }

    if (app.globalData.fxq_userInfo.identity == 3) {
      url2 = config.service.mybalance2
      data2.companyid = app.globalData.fxq_userInfo.companyid
    }
    http.request(this,
      url2, {
        'Authorization': app.globalData.fxq_userInfo.token
      }, data2,
      function(self, data) {
        if (data.status == 200) {
          self.setData({
            balance: data.content.balance
          })
        }
      })
      

    // 获取签章列表
    let url3 = config.service.getsigns
    let data3 = {
      userid: app.globalData.fxq_userInfo.userid
    }

    if (app.globalData.fxq_userInfo.identity == 3) {
      url3 = config.service.getcompanysigns
      data3.companyid = app.globalData.fxq_userInfo.companyid
    }

    http.request(this,
      url3,
      {
        'Authorization': app.globalData.fxq_userInfo.token
      },
      data3,
      function (self, data) {
        if (data.status == 200) {
          let signImgs = data.content.signImgs
          if (app.globalData.fxq_userInfo.identity == 3) {
            signImgs = data.content
          }
          self.setData({
            signImgs: signImgs,
          })
        }
      })
    

    this.setData({
      documentWidth: this.data.A4Width / this.data.ratio,
      documentHeight: (this.data.A4Height / this.data.ratio).toFixed(4)
    })

    console.log(this.data)
  },

  // 点击签署
  showsignature(e) {
    // 显示签章列表
    this.setData({
      visible: !this.data.visible
    })

    // 获取签章列表
    if (this.data.signImgs.length == 0) {
      let url = config.service.getsigns
      let data = {
        userid: app.globalData.fxq_userInfo.userid
      }

      if (app.globalData.fxq_userInfo.identity == 3) {
        url = config.service.getcompanysigns
        data.companyid = app.globalData.fxq_userInfo.companyid
      }

      http.request(this,
        url, 
        {
          'Authorization': app.globalData.fxq_userInfo.token
        }, 
        data,
        function(self, data) {
          if (data.status == 200) {
            let signImgs = data.content.signImgs
            if (app.globalData.fxq_userInfo.identity == 3) {
              signImgs = data.content
            }
            self.setData({
              signImgs: signImgs,
            })
          }
        })
    }
  },

  // 关闭签章列表
  closesign() {
    this.setData({
      visible: false
    })
  },

  // 选择签章
  selectSign(e) {
    let imgs = this.data.imgs
    
    // 是否已确认上个签章
    let signsLength = imgs[this.data.active - 1].signs.length
    if (signsLength > 0) {
      imgs[this.data.active - 1].signs[signsLength - 1].showdel = false //隐藏上个签章的删除按钮
      if (!imgs[this.data.active - 1].signs[signsLength - 1].disabled) {
        wx.showToast({
          title: config.message.M1018,
          icon: 'none'
        })
        setTimeout(function() {
          wx.hideToast()
        }, config.delay)

        return false
      }
    }


    // 创建签章（只在当前页创建）
    let sign = {
      id: e.currentTarget.dataset.id + e.timeStamp,
      x: this.data.x,
      y: this.data.y,
      realx: this.CoordinateConversion(this.data.x, 'realx'),
      realy: this.CoordinateConversion(this.data.y, 'realy'),
      realwidth: this.CoordinateConversion(this.data.x, 'realwidth'),
      realheight: this.CoordinateConversion(this.data.y, 'realheight'),
      url: e.currentTarget.dataset.url,
      num: this.data.active - 1,
      imgid: imgs[this.data.active - 1].id,
      signersid: this.data.signers[0].signerid || this.data.signers[0].id,
      disabled: false,
      showdel: true,
      confirmsign: true,
      userid: app.globalData.fxq_userInfo.userid
    }
    imgs[this.data.active - 1].signs.push(sign)

    // 统一更新为默认签章
    for (var i = 0; i < imgs.length; i++) {
      for (var j = 0; j < imgs[i].signs.length; j++) {
        imgs[i].signs[j].url = e.currentTarget.dataset.url
      }
    }

    this.setData({
      // visible: false,
      imgs: imgs,
      signImgId: e.currentTarget.dataset.id,
      show:false
    })
    
    // console.log(this.data)
  },


  // 删除签章
  deleteSign(e) {
    let imgs = this.data.imgs

    for (var i = 0; i < imgs.length; i++) {
      for (var j = 0; j < imgs[i].signs.length; j++) {
        if(imgs[i].signs[j].id == e.currentTarget.dataset.id){
          imgs[i].signs.pop()
          // 显示上一个签章的删除按钮
          if (e.currentTarget.dataset.index > 0) {
            imgs[i].signs[e.currentTarget.dataset.index - 1].showdel = true
          }
        }
      }
    }

    this.setData({
      imgs: imgs
    })
  },

  // 签章拖拽事件
  getposition(e) {
    // 保存拖拽签章坐标
    this.setData({
      x: e.detail.x,
      y: e.detail.y
    })
    // console.log(e.detail.x, e.detail.y)
  },

  // 缩放签章
  getscale(e) {
    console.log(e)
  },


  // 手绘签章
  drawnSignature(e) {
    let imgs = this.data.imgs
    // 是否已确认上个签章
    let signsLength = imgs[this.data.active - 1].signs.length
    if (signsLength > 0) {
      // imgs[this.data.active - 1].signs[signsLength - 1].showdel = false
      if (!imgs[this.data.active - 1].signs[signsLength - 1].disabled) {
        wx.showToast({
          title: config.message.M1018,
          icon: 'none'
        })
        setTimeout(function() {
          wx.hideToast()
        }, config.delay)

        return false
      }
    }

    wx.navigateTo({
      url: '/pages/draw/draw',
    })
  },

  // 确认签章
  confirmSign(e) {
    let imgs = this.data.imgs

    for (var i = 0; i < imgs.length; i++) {
      for (var j = 0; j < imgs[i].signs.length; j++) {
        if (imgs[i].signs[j].id == e.currentTarget.dataset.id) {
          imgs[i].signs[e.currentTarget.dataset.index].x = this.data.x
          imgs[i].signs[e.currentTarget.dataset.index].y = this.data.y
          imgs[i].signs[e.currentTarget.dataset.index].realx = this.CoordinateConversion(this.data.x, 'realx')
          imgs[i].signs[e.currentTarget.dataset.index].realy = this.CoordinateConversion(this.data.y, 'realy')
          imgs[i].signs[e.currentTarget.dataset.index].realwidth = this.CoordinateConversion(this.data.x, 'realwidth')
          imgs[i].signs[e.currentTarget.dataset.index].realheight = this.CoordinateConversion(this.data.y, 'realheight')
          imgs[i].signs[e.currentTarget.dataset.index].confirmsign = false
          imgs[i].signs[e.currentTarget.dataset.index].disabled = true
          imgs[i].signs[e.currentTarget.dataset.index].showdel = true
        }
      }
    }
    
    this.setData({
      imgs: imgs
    })
  },

  // 完成签署
  doneSign() {
    let contractSign = this.data.contractSign
    let imgs = this.data.imgs

    // 是否签署
    if (!this.data.signImgId) {
      wx.showToast({
        title: config.message.M1024,
        icon: 'none'
      })
      setTimeout(function() {
        wx.hideToast()
      }, config.delay)

      return false
    }

    // 是否有未确认签章
    for (var i = 0; i < imgs.length; i++) {
      for (var j = 0; j < imgs[i].signs.length; j++) {
        if (!imgs[i].signs[j].disabled) {
          wx.showToast({
            title: config.message.M1018,
            icon: 'none'
          })
          setTimeout(function() {
            wx.hideToast()
          }, config.delay)

          return false
        }
      }
    }

    // 是否有余额
    if (this.data.balance <= 0) {
      wx.showToast({
        title: config.message.M1014,
        icon: 'none'
      })
      setTimeout(function() {
        wx.hideToast()
      }, config.delay)

      return false
    }

    // 是否认证
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
    
    wx.showLoading({
      title: config.message.L1001,
    })


    imgs.forEach(function(v, i, imgs) {
      contractSign.push(...imgs[i].signs)
    })

    let url = config.service.updatedefault
    let data = {
      id: this.data.signImgId,
      userid: app.globalData.fxq_userInfo.userid
    }

    if (app.globalData.fxq_userInfo.identity == 3) {
      url = config.service.setCompanyDefaultSign
      data.companyid = app.globalData.fxq_userInfo.companyid
    }

    // 设置默认签章
    http.request(this,
      url, {
        'Authorization': app.globalData.fxq_userInfo.token
      }, data,
      function(self, data) {
        if (data.status == 200) {
          // 是否撤回
          let url1 = config.service.equalcontract
          let data1 = {
            id: self.data.contractId,
            userid: app.globalData.fxq_userInfo.userid,
          }
          if (app.globalData.fxq_userInfo.identity == 3) {
            url1 = config.service.equalcontract2
            data1.companyid = app.globalData.fxq_userInfo.companyid
          }
          http.request(self,
            url1, {
              'Authorization': app.globalData.fxq_userInfo.token
            }, data1,
            function (self, data) {
              if (data.status == 200) {
                // 生成签章合同
                let url2 = config.service.pdf
                let data2 = {
                  id: self.data.contractId,
                  userid: app.globalData.fxq_userInfo.userid,
                  contractSign: self.data.contractSign // 使用pdfImg中的signs字段中的坐标值
                }
                if (app.globalData.fxq_userInfo.identity == 3) {
                  url2 = config.service.pdf2
                  data2.companyid = app.globalData.fxq_userInfo.companyid
                }
                http.request(self,
                  url2, {
                    'Authorization': app.globalData.fxq_userInfo.token
                  }, data2,
                  function (self, data) {
                    if (data.status == 200) {
                      if (self.data.userContractId) {
                        wx.reLaunch({
                          url: '/pages/contract/contract?type=1',
                        })
                      } else {
                        wx.reLaunch({
                          url: '/pages/contract/contract?type=2',
                        })
                      }
                    }
                    wx.hideLoading()
                  })
              }
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
      })
  },

  // 手绘签章
  drawnSignature(e) {
    let imgs = this.data.imgs
    // 是否已确认上个签章
    let signsLength = imgs[this.data.active - 1].signs.length
    if (signsLength > 0) {
      // imgs[this.data.active - 1].signs[signsLength - 1].showdel = false
      if (!imgs[this.data.active - 1].signs[signsLength - 1].disabled) {
        wx.showToast({
          title: config.message.M1018,
          icon: 'none'
        })
        setTimeout(function() {
          wx.hideToast()
        }, config.delay)

        return false
      }
    }

    wx.navigateTo({
      url: '/pages/draw/draw',
    })
  },

  // 滚动条事件
  scroll(e) {
    var that = this;
    var len = e.detail.scrollTop;
    var length = that.data.documentHeight - 1 + 1 + len;
    if (len % that.data.documentHeight > that.data.documentHeight / 2) {
      that.setData({
        active: Math.floor(length / that.data.documentHeight) + 1
      })
    } else {
      that.setData({
        active: Math.floor(length / that.data.documentHeight)
      })
    }
    // console.log(e)
  },

  // 坐标转换 realx:左下角x轴坐标，realy：左下角y轴坐标，realwidth：右上角x轴坐标，realheight：右上角y轴坐标
  CoordinateConversion(value, type) {
    let rs = 0
    if (type == 'realx') {
      rs = value * this.data.ratio
    } else if (type == 'realy') {
      rs = (this.data.documentHeight - (value + this.data.rectangleH)) * this.data.ratio
    } else if (type == 'realwidth') {
      rs = (value + this.data.rectangleW) * this.data.ratio
    } else if (type == 'realheight') {
      rs = (this.data.documentHeight - value) * this.data.ratio
    }

    return rs
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
    // 自动添加手绘签名
    if (wx.getStorageSync('signImg')) {
      http.request(this,
        config.service.getsigns, {
          'Authorization': app.globalData.fxq_userInfo.token
        }, {
          userid: app.globalData.fxq_userInfo.userid
        },
        function(self, data) {
          if (data.status == 200) {
            data.content.signImgs.forEach(function(v, i, signImgs) {
              if (!v.status) {
                let imgs = self.data.imgs

                // 是否已确认上个签章
                let signsLength = imgs[self.data.active - 1].signs.length
                if (signsLength > 0) {
                  imgs[self.data.active - 1].signs[signsLength - 1].showdel = false
                  if (!imgs[self.data.active - 1].signs[signsLength - 1].disabled) {
                    wx.showToast({
                      title: config.message.M1018,
                      icon: 'none'
                    })
                    setTimeout(function() {
                      wx.hideToast()
                    }, config.delay)

                    return false
                  }
                }

                // 创建签章（只在当前页创建）
                let sign = {
                  id: v.id,
                  x: self.data.x,
                  y: self.data.y,
                  realx: self.CoordinateConversion(self.data.x, 'realx'),
                  realy: self.CoordinateConversion(self.data.y, 'realy'),
                  realwidth: self.CoordinateConversion(self.data.x, 'realwidth'),
                  realheight: self.CoordinateConversion(self.data.y, 'realheight'),
                  url: v.url,
                  num: self.data.active - 1,
                  imgid: imgs[self.data.active - 1].id,
                  signersid: self.data.signers[0].signerid || self.data.signers[0].id,
                  disabled: false,
                  showdel: true,
                  confirmsign: true,
                }
                imgs[self.data.active - 1].signs.push(sign)

                // 统一更新为默认签章
                for (var i = 0; i < imgs.length; i++) {
                  for (var j = 0; j < imgs[i].signs.length; j++) {
                    imgs[i].signs[j].url = v.url
                  }
                }

                self.setData({
                  imgs: imgs,
                  signImgId: v.id,
                  signImgs: data.content.signImgs
                })
              }

            })
          }
        })


    }
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