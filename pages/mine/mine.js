//获取应用实例
const app = getApp();
const Trequest = require('../../static/js/request.js');

Page({
  data: {
    userInfo: {},
    expireTime: '',
  },
  onShow: function() {
    var userInfo = wx.getStorageSync('user_info').data || '';
    if (!userInfo) {
      wx.redirectTo({
        url: "/pages/login/login?pageAs=mine"
      });
      return false;
    } else {
      Trequest({
        url: 'user/detail',
        data: {},
        callback(res) {
          wx.setStorageSync("user_info", res.data);
        }
      });
      var expireTime = userInfo && userInfo.userVip && userInfo.userVip.expire_time ? userInfo.userVip.expire_time.split(' ')[0] : '';
      this.setData({
        userInfo: userInfo,
        expireTime: expireTime
      })
    }
  },
  onLoad: function() {
    var that = this,
      userInfo = wx.getStorageSync('user_info');
    if (userInfo) {
      that.setData({
        userInfo: userInfo.data
      })
    }
  }
})