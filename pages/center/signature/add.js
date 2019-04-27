// pages/center/signature/add.js
var config = require("../../../config.js");
var http = require('../../../utils/request.js')

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    accountType:'person',

    // 自定义签章公共参数

    title: '',  // 标题
    name: '签章名称', //展示的签章名称
    color: 1,    //颜色 1: 红色, 2: 黑色, 3: 蓝色（个人）  | 0 红色 1.蓝色 2.黑（企业）
    font: 1,  //字体 1:正方黑体,2:仿宋,3:楷体（个人）  | 0 宋体 1.方正黑体 2.楷体（企业）
    type: '', // 是否存库，空字符串不存库（个人）

    // 个人自定义签章参数
    shape: 1,   //形状,1:正方形  2:长方形

    // 企业自定义签章参数
    // companyName: '',  //标题
    iscircle: true,  //是否是圆  false表示椭圆
    transverse: '',  // 横向文
    seaNo: '',  //下弦文
    
    src:'',
    base64:'',

    // data:{
    //   src: '',
    // }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let accountType = this.data.accountType
    let color = this.data.color
    let font = this.data.font
    if (app.globalData.fxq_userInfo.identity == 3) {
      accountType = 'company'
      color = 0
      font = 0
    }

    this.setData({
      accountType: accountType,
      color: color,
      font:font
    })
  },

  // 签章标题
  getTitle: function (e) {
    let t = ''
    if (this.data.accountType == 'person'){
      if (e.detail.value.length > 1 && e.detail.value.length < 3 && this.data.shape == 1) {
        t = this.data.title + '之印'
        // t = '之' + e.detail.value[0] + '印' + e.detail.value[1]
      } else if (e.detail.value.length > 1 && e.detail.value.length < 4 && this.data.shape == 1) {
        t = this.data.title + '印'
        // t = e.detail.value[2] + e.detail.value[0] + '印' + e.detail.value[1]
      } else {
        t = e.detail.value
      }
    }else{
      t = e.detail.value
    }
    
    this.setData({
      title: e.detail.value,
      name: t
    })
  },

  // 横向文
  getTransverse: function (e) {
    this.setData({
      transverse: e.detail.value
    })
  },

  // 下旋文
  getSeaNo: function (e) {
    this.setData({
      seaNo: e.detail.value
    })
  },

  // 签章颜色
  getColor: function (e) {
    if(!this.data.title){
      wx.showToast({
        title: config.message.M1032,
        icon: 'none'
      })

      return false
    }

    this.setData({
      color: e.currentTarget.dataset.value
    })
    
    this.newSign()
  },

  // 签章样式
  getStyle: function (e) {
    if (!this.data.title || this.data.title.length < 2) {
      wx.showToast({
        title: config.message.M1036,
        icon: 'none'
      })

      return false
    }
    
    if (this.data.accountType == 'person') {
      let t = ''
      if (this.data.title.length > 1 && this.data.title.length < 3 && e.currentTarget.dataset.broder == 1) {
        t = this.data.title + '之印'
        // t = '之' + this.data.title[0] + '印' + this.data.title[1]
      } else if (this.data.title.length > 1 && this.data.title.length < 4 && e.currentTarget.dataset.broder == 1) {
        t = this.data.title + '印'
        // t = this.data.title[2] + this.data.title[0] + '印' + this.data.title[1]
      } else {
        t = this.data.title
      }
      
      this.setData({
        shape: e.currentTarget.dataset.broder,
        font: e.currentTarget.dataset.font,
        name: t
      })
    }else{
      this.setData({
        font:0,
        iscircle: e.currentTarget.dataset.value == '1' ? true : false
      })
    }

    this.newSign()
  },

  newSign(){
    if (this.data.accountType == 'person'){
      http.request(this,
        config.service.customPersonSign,
        {
          'Authorization': app.globalData.fxq_userInfo.token
        }, {
          username: this.data.title,
          shape: this.data.shape,   
          color: this.data.color,   
          font: this.data.font, 
          type: this.data.type, 
          userid: app.globalData.fxq_userInfo.userid
        },
        function (self, data) {
          if (data.status == 200) {
            self.setData({
              src: data.content,
            })
          }
          wx.hideLoading()
        })
    }else{
      http.request(this,
        config.service.newsign,
        {
          'Authorization': app.globalData.fxq_userInfo.token
        }, {
          companyName: this.data.title,
          title: this.data.transverse,
          seaNo: this.data.seaNo,
          iscircle: this.data.iscircle,  
          color: this.data.color,    
          font: 0,  
          companyid: app.globalData.fxq_userInfo.companyid
        },
        function (self, data) {
          if (data.status == 200) {
            self.setData({
              src: data.content,
              base64: data.content.replace('data:image/png;base64,', '')
            })
          }
          wx.hideLoading()
        })
    }
    // console.log(this.data)
  },

  confirm(e){
    wx.showLoading({
      title: config.message.L1001,
    })

    let url = config.service.customPersonSign
    let params = {
      username: this.data.title,
      shape: this.data.shape,   //形状,1:正方形,2:长方形
      color: this.data.color,    //颜色 1: 红色, 2: 黑色3: 蓝色
      font: this.data.font,  //字体 1:楷体,2:仿宋,3:正方黑体
      type: 1, 
      userid: app.globalData.fxq_userInfo.userid
    }

    if (this.data.accountType == 'company'){
      url = config.service.customCompanySign
      params = {
        base64: this.data.base64,
        companyid: app.globalData.fxq_userInfo.companyid
      }
    }else{
      let t = ''
      if (this.data.title.length < 3 && this.data.shape == 1) {
        t = '之印'
      } else if (this.data.title.length < 4 && this.data.shape == 1) {
        t = '印'
      }
      params.username = params.username + t
    }
    
    http.request(this,
      url, 
      {
        'Authorization': app.globalData.fxq_userInfo.token
      }, params,
      function (self, data) {
        if (data.status == 200) {
          wx.showToast({
            title: config.message.M1030,
            icon: 'success'
          })
          setTimeout(function () {
            wx.hideToast()
            wx.navigateBack({
              delta: 1,
            })
          }, config.delay)
        }
        wx.hideLoading()
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