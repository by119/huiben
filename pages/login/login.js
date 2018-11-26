var e = require("../../static/js/request.js"),
  t = getApp();

Page({
  data: {
    page: '',
    options: ''
  },
  onLoad: function(e) {
    // console.log(e.pageAs, e, 'pageAs');
    var str = '',pageAs='';
    for (let i in e) {
      if (i == 'pageAs'){
        pageAs = e[i];
      }else {
         if (str == '') {
          str += '?' + i + '=' + e[i];
        } else {
          str += '&' + i + '=' + e[i];
        }
      }
    }
    this.setData({
      pageAs: pageAs,
      options: str,
    })
  },
  getUserInfo: function(t) {
    // console.log(wx.getStorageSync("state"), 'wx.getStorageSync("state")');
    var that = this;
    //  "getUserInfo:ok" == t.detail.errMsg && (
    //   wx.showLoading({
    //       title: "正在登录",
    //       mask: !0
    //   }), 
    wx.login({
      success: function(o) {
        var n = o.code;
        wx.request({
          url: 'https://huiben.fengsh.cn/api/user/wechatLoginMiniProgram',
          method: "POST",
          data: {
            code: n,
            encryptedData: t.detail.encryptedData,
            iv: t.detail.iv,
            headimgurl: t.detail.userInfo.avatarUrl,
            nickname: t.detail.userInfo.nickName,
            state: wx.getStorageSync("state")
          },
          success: function(e) {
            if (200 == e.statusCode) {
              wx.setStorageSync("access_token", t), wx.setStorageSync("user_info", e.data);
              if (that.data.pageAs == 'lately') {
                wx.switchTab({
                  url: "/pages/lately/lately"
                });
              } else if (that.data.pageAs == 'mine') {
                wx.switchTab({
                  url: "/pages/mine/mine"
                });
              } else if (that.data.pageAs == 'video') {
                wx.redirectTo({
                  url: "/pages/video/video" + that.data.options
                });
              } else if (that.data.pageAs == 'mine-vip') {
                wx.redirectTo({
                  url: "/pages/mine-vip/mine-vip"
                });
              } else if (that.data.pageAs == 'code') {
                wx.redirectTo({
                  url: "/pages/share-code/share-code"
                });
              } else if (that.data.pageAs == 'share') {
                wx.redirectTo({
                  url: "/pages/mine-share/mine-share"
                });
              } else if (that.data.pageAs == 'collect') {
                wx.redirectTo({
                  url: "/pages/mine-collect/mine-collect"
                });
              } else if (that.data.pageAs == 'balance') {
                wx.redirectTo({
                  url: "/pages/mine-balance/mine-balance"
                });
              } else if (that.data.pageAs == 'coupon') {
                wx.redirectTo({
                  url: "/pages/coupon/coupon" + that.data.options
                });
              }
            }
          },
          complete: function() {
            wx.hideLoading();
          }
        });
      },
      fail: function(e) {

      }
    });
  },
});