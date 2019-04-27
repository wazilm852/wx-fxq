var config = require('../config.js')

// 统一封装接口请求
function request(self, url, header, data, callback) {
  wx.request({
    method: "POST",
    url: url,
    header: header || { 'content-type': 'application/json' },
    data: data,
    success(res) {
      if (res.statusCode == 200) {
        callback(self, res.data) 
      } else {
        wx.hideLoading()
        wx.showToast({
          title: res.statusCode.toString(),
          icon: 'none'
        })
        setTimeout(function () {
          wx.hideToast()
        }, config.delay)
      }
    },
    fail: function () {
      wx.hideLoading()
      wx.showToast({
        title: config.message.A1001,
        icon: 'none'
      })
      setTimeout(function () {
        wx.hideToast()
      }, config.delay)
    }
  })
}

// 统一封装上传请求
function upload(self, url, filepath, name, header, formData,callback){
  wx.uploadFile({
    url: url,
    filePath: filepath,
    name: name||'file',
    header: header,
    formData: formData,
    success: function (res) {
      if (res.statusCode == 200) {
        callback(self, JSON.parse(res.data))
      } else {
        wx.hideLoading()
        wx.showToast({
          title: res.statusCode.toString(),
          icon: 'none'
        })
        setTimeout(function () {
          wx.hideToast()
        }, config.delay)
      }
    },
    fail: function (err) {
      wx.hideLoading()
      wx.showToast({
        title: config.message.A1001,
        icon: 'none'
      })
      setTimeout(function () {
        wx.hideToast()
      }, config.delay)
    }
  })
}


module.exports = {
  request: request,
  upload:upload
}