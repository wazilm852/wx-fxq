/**
 * 小程序配置文件
 */

// 请求域名主机地址
var host = "https://sign.fangxinqian.cn"
var websocket = "wss://sign.fangxinqian.cn"

var config = {

    appid: 'wx17d76018d66223d1',   
    secret: 'e5e869ada94216cfeef7a7aea19b1a08',  //90db799ec3ea20ab5db06bf93b242873

    pdfoss:'https://pdf.fangxinqian.cn/', // 需带最后斜杠

    delay:1500, // 消息弹框消失延迟时间

    // api接口地址
    service: {
      host,
      websocket,

      // websocket接口地址
      convertingSocket: websocket + '/socket/convertingSocket/',   // 转换合同完成通知

      // 公共api接口地址
      getOpenid: host + '/token-manager/unchk/auth/wx/getopenid',  // 调用服务器后台接口，换取 用户唯一标识 OpenID 和 会话密钥 session_key
      login: `${host}/token-manager/unchk/auth/wx/wxapp`,  // 授权登录，200 用户已经绑定用户   30 用户未绑定账号 
      bind: `${host}/token-manager/unchk/auth/wx/bind`,  // 绑定账号
      isRegister: `${host}/token-manager/unchk/auth/register/isregister`,  // 是否注册
      register: `${host}/token-manager/unchk/auth/register/main`,  // 注册用户
      getcode: `${host}/token-manager/unchk/auth/register/getcode`,  // 获取验证码（注册用户）
      uploadContract: `${host}/zuul/business/personal/uploadContract/upload2`, //发起合同
      uploadImgs: `${host}/zuul/business/personal/uploadContract/uploadImgs`, //发起合同
      getSystemplate: `${host}/personal-api/api/personal/AllTemplate/select-template`, //获取系统模板
      signTemplate: `${host}/personal-api/api/personal/AllTemplate/sign-template`, //发起系统模板合同

      // 个人版api接口地址
      // phoneLogin: `${host}/token-manager/unchk/auth/login/phoneLogin`,  // 自动注册用户
      // loginCode: `${host}/token-manager/unchk/auth/login/loginCode`,  // 获取验证码（自动注册用户）
      getcontracts: `${host}/personal-api/api/personal/usercontract/getcontracts`,   // 首页全部合同
      getcontractlist: `${host}/personal-api/api/personal/usercontract/getcontractlist`,   // 首页列表数据
      getcondetail: `${host}/personal-api/api/personal/usercontract/getcondetail`,  // 个人版获取合同详情
      personRecall: `${host}/personal-api/api/personal/contractmana/recall`, //个人版撤回合同
      personReject: `${host}/personal-api/api/personal/contractmana/stop`, //个人版拒签合同
      personStartSign: `${host}/personal-api/api/personal/itext/startSign`, //个人版获取签章
      uploadSign: `${host}/personal-api/api/personal/seal/base64Upload`, //上传签章,企业用户不能上传签章
      // personGetSignCheckCode: `${host}/company-api/api/employee/unchk/check/genersigncode`, //个人版获取签署短信验证码
      // companyGetSignCheckCode: `${host}/personal-api/api/personal/unchk/check/genersigncode`, //企业版获签署取短信验证
      // personVerifySignCode: `${host}/personal-api/api/personal/unchk/check/chksigncode`, //个人版验证短信验证码
      // companyVerifySignCode: `${host}/company-api/api/employee/unchk/check/chksigncode`, //企业版验证短信验证码
      personCertificate: `${host}/token-manager/unchk/auth/authenticate/pcommitmater`, //上传个人三要素
      personCertificateGetCode: `${host}/token-manager/unchk/auth/authenticate/personcheck`, //实名认证获取验证码
      personCertificateVerifyCode: `${host}/token-manager/unchk/auth/authenticate/checkcode`, //实名认证验证短信验证码
      personFinishVerify: `${host}/token-manager/unchk/auth/authenticate/chkstaus`, //实名认证成功修改用户状态值
      personRemindAll: `${host}/personal-api/api/personal/contractremind/allremind`, //个人提醒所有未签署用户
      getfirstimg: `${host}/personal-api/api/personal/usercontract/pdfUrlAndFirstImg`, //获取合同首图
      getimgs: `${host}/personal-api/api/personal/usercontract/getimgs`, //获取合同图片列表
      addLinkMan: `${host}/personal-api/api/personal/linkman/addLinkMan`, //添加签署人
      linkmanpage: `${host}/personal-api/api/personal/linkman/linkmanpage`, //查询签署人列表
      queryGroup: `${host}/personal-api/api/personal/linkgroup/queryGroup`, //查询签署人分组
      saveSigners: `${host}/personal-api/api/personal/signn/saveSigners`, //保存签署人
      selectsignport: `${host}/personal-api/api/personal/usercontract/selectsignport`, //选择签署点
      area: `${host}/personal-api/api/personal/itext/area`, //保存签署区域
      startSign: `${host}/personal-api/api/personal/itext/startSign`, //开始签署
      genersigncode: `${host}/personal-api/api/personal/unchk/check/genersigncode`, //获取签署短信验证码
      chksigncode: `${host}/personal-api/api/personal/unchk/check/chksigncode`, //校验签署短信验证码
      equalcontract: `${host}/personal-api/api/personal/contractmana/equalcontract`, //判断合同是否已撤回
      pdf: `${host}/personal-api/api/personal/itext/pdf`, //个人版完成签署
      base64Upload1: `${host}/personal-api/api/personal/seal/wxbase64Upload`, //上传手绘签章（竖屏）
      base64Upload2: `${host}/personal-api/api/personal/digitalsign/base64upload`, //上传手绘签章（横屏）
      getsigns: `${host}/personal-api/api/personal/digitalsign/getsigns`, //获取签章列表
      mybalance: `${host}/personal-api/api/personal/balance/mybalance`, //查询个人余额
      select: `${host}/personal-api/api/personal/template/select`, //选择模板
      use: `${host}/personal-api/api/personal/template/use`, //使用模板
      sign: `${host}/personal-api/api/personal/template/sign`, //签署模板
      deleteLinkMan: `${host}/personal-api/api/personal/linkman/deleteLinkMan`, //删除联系人
      updateLinkMan: `${host}/personal-api/api/personal/linkman/updateLinkMan`, //更新联系人信息
      updatedefault: `${host}/personal-api/api/personal/digitalsign/updatedefault`, //设置默认签章
      deleteSignature: `${host}/personal-api/api/personal/digitalsign/deletesign`, //删除签章
      getPersonOrder: `${host}/personal-api/api/personal/product/selectallproduct`, //获取个人套餐
      getAccountInfo: `${host}/personal-api/api/personal/unchk/user/accountinfo`, //获取个人信息
      sendEmailCode: `${host}/personal-api/api/personal/unchk/check/generaccountemailcode`, //发送邮箱验证码
      verifyEmailCode: `${host}/personal-api/api/personal/unchk/check/chkaccountemailcode`, //验证邮箱验证码
      customPersonSign: `${host}/personal-api/api/personal/seal/create`, //自定义签章
      identifyCheck: `${host}/token-manager/personal/face`, //认证照片识别
      
      

      // 企业版api接口地址
      queryUserDetail: `${host}/company-api/api/employee/unchk/user/queryUserDetail`,  // 获取个人信息如下: type:1表示个人2表示企业 identity 0表示未认证 1表示认证
      getconcompanydetail: `${host}/company-api/api/manager/usercontract/getconcompanydetail`, //企业版获取合同详情
      getcontractlist2: `${host}/company-api/api/employee/usercontract/getcontractlist`,  //企业版获取合同列表
      companyRecall: `${host}/company-api/api/employee/contractmana/recall`, //企业版撤回合同
      companyReject: `${host}/company-api/api/employee/contractmana/stop`, //企业版拒签合同
      getfirstimg2: `${host}/personal-api/api/personal/usercontract/pdfUrlAndFirstImg`, //企业版获取合同首图
      select2: `${host}/company-api/api/employee/template/select`, //我的模板
      use2: `${host}/company-api/api/employee/template/use`, //使用模板
      sign2: `${host}/company-api/api/employee/template/sign`, //签署模板
      mybalance2: `${host}/company-api/api/employee/balance/mybalance`, //查询余额（企业）
      getcompanysigns: `${host}/company-api/api/employee/digitalsign/getcompanysigns`, //企业版获取签章
      setCompanyDefaultSign: `${host}/company-api/api/employee/digitalsign/setCompanyDefaultSign`, //企业版设置默认签章
      deletecompanysign: `${host}/company-api/api/boss/delSign/deletecompanysign`, //企业版删除签章
      uploadphoto: `${host}/company-api/api/employee/admincheck/uploadphoto`, //企业上传签章图片
      addcompanysign: `${host}/company-api/api/boss/delSign/addcompanysign`, //企业版添加签章
      companyRemindAll: `${host}/company-api/api/employee/contractremind/allremind`, //企业提醒所有未签署用户
      queryGroup2: `${host}/company-api/api/employee/linkgroup/queryGroup`, //查询签署人分组
      addLinkMan2: `${host}/company-api/api/boss/linkman/addLinkMan`, //添加签署人
      deleteLinkMan2: `${host}/company-api/api/boss/linkman/deleteLinkMan`, //删除联系人
      updateLinkMan2: `${host}/company-api/api/boss/linkman/updateLinkMan`, //更新联系人信息
      linkmanpage2: `${host}/company-api/api/boss/linkman/linkmanpage`, //查询签署人列表
      saveSigners2: `${host}/company-api/api/employee/signn/saveSigners`, //保存签署人
      selectsignport2: `${host}/company-api/api/employee/usercontract/selectsignport`, //选择签署点
      startSign2: `${host}/company-api/api/employee/itext/startSign`, //开始签署
      equalcontract2: `${host}/company-api/api/employee/contractmana/equalcontract`, //是否撤回
      pdf2: `${host}/company-api/api/employee/itext/pdf`, //完成签署
      newsign: `${host}/company-api/api/employee/digitalsign/newsign`, //自定义签章（生成）
      customCompanySign: `${host}/company-api/api/employee/digitalsign/uploadbase64`, //自定义签章（上传）
    },

    // error message
    message:{
      A1001: '服务器内部错误',
      A1002: 'websocket返回失败',

      L1001: '正在拼命加载中',
      L1002: '暂无更多数据',
      L1003: '缺少必传参数',

      E1001:'绘制签名失败',

      M1001: '用户未绑定',
      M1002: '用户绑定成功，正在跳转...',
      M1003: '用户注册成功，正在跳转...',
      M1004: '验证码发送成功',
      M1005: '验证码发送失败',
      M1006: '账号密码不能为空',
      M1007: '三要素不能为空',
      M1008: '三要素匹配成功,短信验证码发送成功',
      M1009: '三要素匹配失败, 请重新输入',
      M1010: '请完成三要素认证',
      M1011: '短信验证成功,完成认证',
      M1012: '短信验证失败',
      M1013: '用户认证成功',
      M1014: '您的套餐已用完',
      M1015: '联系人添加成功',
      M1016: '联系人添加失败',
      M1017: '至少添加一个接收签署人',
      M1018: '请先确认签章',
      M1019: '请先等待合同转换完成',
      M1020: '邮箱验证码发送成功',
      M1021: '邮箱不能为空',
      M1022: '邮箱验证码发送失败',
      M1023: '已使用签章不能删除',
      M1024: '请先签署',
      M1025: '更新联系人信息成功',
      M1026: '删除联系人成功',
      M1027: '签名绘制成功',
      M1028: '用户未认证，请先完成认证',
      M1029: '请先绘制签章',
      M1030: '添加签章成功',
      M1031: '用户认证失败',
      M1032: '请先输入签章名称',
      M1033: '请输入姓名，身份证',
      M1034: '确定撤回？',
      M1035: '确定拒签？',
      M1036: '签章名称不得少于2字',
      M1037: '请输入正确的身份证号',
      M1038: '请输入正确有效的手机号',
      M1039: '请在发起签署10分钟后提醒用户',
      M1040: '请填写完整有效信息',
      M1041: '请填写合同名称',
      M1042: '请输入正确有效的手机号或邮箱',
    }
};

module.exports = config;