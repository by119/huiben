const Trequest = require('../../static/js/request.js');
Page({
  data: {
    balanceCount: '0',
    list: [],
    numPerPage: 10, //设置默认一次加载数据条数
    pageNum: 1, // 设置加载的第几次，默认是第一次
    hasMore: true, // “加载更多”
    ifLoad: false,
    total: 0 // regardData数组（最近学习记录）的条数
  },
  onShow: function () { //balance
    var userInfo = wx.getStorageSync('user_info').data || '';
    if (!userInfo) {
      wx.redirectTo({
        url: "/pages/login/login?pageAs=balance"
      });
      return false;
    } else {
      this.setData({
        userInfo: userInfo
      })
    }
    this.setData({
      balanceCount: wx.getStorageSync('user_info').data.money
    })
  },
  onLoad: function(options) {
    // 用户余额 明细
    this.getList({
      type: 0,
      numPerPage: this.data.numPerPage,
      p: this.data.pageNum
    })
  },
  getList: function (params) {
    var that = this,
      ifLoad = false,
      arr1 = that.data.list,
      arr2 = [];
    Trequest({
      url: 'user_money_log/getlist',
      data: params,
      callback(res) {
        arr2 = res.data.data;
        that.setData({
          list: arr1.concat(arr2),
          total: res.data.total
        })
        let page = that.data.pageNum,
          a = that.data.total / that.data.numPerPage;
        if (page < a) {
          ifLoad = true;
        } else {
          ifLoad = false;
        }
        that.setData({
          ifLoad: ifLoad
        })
      }
    });
  },
  // 上拉加载
  onReachBottom: function () {
    let that = this,
      ifLoad = this.data.ifLoad,
      page = this.data.pageNum,
      a = this.data.total / this.data.numPerPage;
    if (ifLoad == true) {
      if (page < a) {
        page++;
        let params = {
          numPerPage: that.data.numPerPage,
          p: page
        };
        that.getList(params);
        that.setData({
          hasMore: true,
          pageNum: page
        })
      } else {
        that.setData({
          hasMore: false,
          ifLoad: false
        })
      }
    } else {
      that.setData({
        hasMore: false,
        ifLoad: false
      })
    }
  }
})