
const Trequest = require('../../static/js/request.js')
Page({
  data: {
    collectData: []
  },
  onShow: function () {
    var userInfo = wx.getStorageSync('user_info').data || '';
    if (!userInfo) {
      wx.redirectTo({
        url: "/pages/login/login?pageAs=collect"
      });
      return false;
    } else {
      this.setData({
        userInfo: userInfo
      })
      var that = this;
      // 获取收藏列表
      Trequest({
        url: 'collection/getlist',
        data: {},
        callback(res) {
          that.setData({
            collectData: res.data.data
          })
        }
      });
    }
  },
})
