// pages/setting/setting.js
const Trequest = require('../../static/js/request.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    PhoneNumber: ''
  },
  onShow: function() {
    var phoneNumber = wx.getStorageSync('phone_number');
    if (phoneNumber) {
      this.setData({
        PhoneNumber: phoneNumber
      })
    } else {
      this.setData({
        PhoneNumber: ''
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},
  getPhoneNumber: function(e) {
    var that = this;
    // console.log(`是否成功调用${e.detail.errMsg}`);
    // console.log(`加密算法的初始向量:${e.detail.iv}`);
    // console.log(`包括敏感数据在内的完整用户信息的加密数据:${e.detail.encryptedData}`);
    wx.login({
      success: function(i) {
        if (i.code) {
          var o = i.code;
          Trequest({
            url: 'wechat/decrypt',
            data: {
              iv: e.detail.iv,
              encryptedData: e.detail.encryptedData,
              code: o
            },
            callback(n) {
              if (n.data != null) {
                var phoneNumber = wx.getStorageSync('phone_number');
                if (n.data.phoneNumber) {
                  phoneNumber = n.data.phoneNumber;
                  wx.showToast({
                    title: "授权成功",
                    icon: 'success'
                  });
                } else {
                  phoneNumber = '';
                  wx.showToast({
                    title: "授权失败,请重试",
                    icon: 'none'
                  });
                }
                wx.setStorageSync('phone_number', phoneNumber);
                that.setData({
                  PhoneNumber: phoneNumber
                })
              } else {
                wx.showToast({
                  title: "授权失败,请重试",
                  icon: 'none'
                });
              }
            }
          });
        } else wx.showToast({
          title: "获取用户登录态失败！" + i.errMsg,
          image: "/images/icon-warning.png"
        });
      }
    });
  }
})