const Trequest = require('../../static/js/request.js');
Page({
  data: {
    userInfo: {},
    money: '0.00',
    codeImg: '',
    systemInfo: {}
  },
  onShow: function() {
    var userInfo = wx.getStorageSync('user_info').data || '';
    if (!userInfo) {
      wx.redirectTo({
        url: "/pages/login/login?pageAs=share"
      });
      return false;
    } else {
      this.setData({
        userInfo: userInfo,
        money: userInfo.money
      })
    }
  },
  withdrawFn: function() {
    // console.log('提现');
    var that = this;
    wx.showModal({
      title: "提示",
      content: "确定要将全部佣金提现？",
      success: function(e) {
        e.confirm && (wx.showLoading({
          title: "提现中",
          mask: !0
        }), Trequest({
          url: 'withdraw/add',
          data: {
            amount: parseFloat(that.data.userInfo.money)
          },
          callback(res) {
            if (res.data && res.data.money) {
              that.setData({
                money: res.data.money
              })
            }
            wx.showToast({
              icon: 'none',
              title: res.data.msg,
            });
          }
        }));
      }
    });
  },
  saveCode: function(e) {
    let current = e.currentTarget.dataset.src,
      that = this;
    wx.showLoading({
      title: '加载中',
    })
    if (that.data.codeImg != '') {
      wx.previewImage({
        current: current, // 当前显示图片的http链接
        urls: [that.data.codeImg], // 需要预览的图片http链接列表
        success: function(res) {
          // console.log('接口调用成功的回调函数');
        },
        fail: function(res) {
          // console.log('接口调用失败的回调函数');
        },
        complete: function(res) {
          // console.log('接口调用结束的回调函数'); 
          wx.hideLoading();
        },
      });
      return false;
    }
    // 获取二维码
    Trequest({
      url: 'wechat/qrcode',
      data: {},
      callback(res) {
        that.setData({
          codeImg: res.data
        })
        wx.previewImage({
          current: current, // 当前显示图片的http链接
          urls: [res.data], // 需要预览的图片http链接列表
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {
            wx.hideLoading();
          },
        });
      }
    });
  },
  onShareAppMessage: function() {
    var that = this,
      str = '',
      auth = '',
      userInfo = wx.getStorageSync('user_info').data || '';
    str = userInfo && userInfo.nickname ? userInfo.nickname : '';
    auth = userInfo && userInfo.auth ? userInfo.auth : '';
    console.log('/pages/suggest/suggest?auth=' + auth);
    // 分享按钮
    return {
      title: '您的好友' + str + ',邀请您一起学英语！',
      desc: '',
      path: '/pages/suggest/suggest?auth=' + auth
    }
  }
})