var app = getApp()
const Trequest = require('../../static/js/request.js')
Page({
  data: {
    currentTab: 0,
    regardData: [],
    subjectId: 2,
    pageUrl: '/pages/video/video',
    numPerPage: 10, //设置默认一次加载数据条数
    pageNum: 1, // 设置加载的第几次，默认是第一次
    hasMore: true, // “加载更多”
    ifLoad: false,
    total: 0, // regardData数组（最近学习记录）的条数
    scrollTop:0 //scroll-view的滚动高度
  },
  onShow: function() {
    var userInfo = wx.getStorageSync('user_info').data || '';
    if (!userInfo) {
      wx.redirectTo({
        url: "/pages/login/login?pageAs=lately"
      });
      return false;
    }
    this.setData({
      regardData: [],
      pageNum: 1
    })
    this.getList({
      subject_id: 2,
      numPerPage: this.data.numPerPage,
      p: this.data.pageNum
    });
  },
  onLoad: function(options) {},
  getList: function(params) {
    // subject_id:   视: 2   听：3   读：4
    var that = this,
      ifLoad = false,
      arr1 = that.data.regardData,
      arr2 = [];
    Trequest({
      url: 'user_visit_log/getlist',
      data: params,
      callback(res) {
        arr2 = res.data.data;
        that.setData({
          regardData: arr1.concat(arr2),
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
  //滑动切换
  // swiperTab: function(e) {
  //   var that = this;
  //   that.setData({
  //     currentTab: e.detail.current
  //   });
  // },
  //点击切换
  clickTab: function(e) {
    var that = this;
    var current = e.target.dataset.current;
    var subject_id = null;
    switch (current) {
      case '0':
        subject_id = 2;
        break;
      case '1':
        subject_id = 3;
        break;
      case '2':
        subject_id = 4;
        break;
    }
    that.setData({
      currentTab: current,
      subjectId: subject_id,
      regardData: [],
      pageNum: 1
    })
    this.getList({
      subject_id: subject_id,
      numPerPage: this.data.numPerPage,
      p: this.data.pageNum
    });
  },
  // 删除单条记录 
  //user_visit_log/delete id=要删的收藏ID
  _delFn: function(e) {
    var that = this,
      delid = e.detail.delid,
      regardData = this.data.regardData,
      total = this.data.total;
    Trequest({
      url: 'user_visit_log/delete',
      data: {
        id: delid
      },
      callback(res) {
        for (let i in regardData) {
          if (regardData[i].id == delid) {
            regardData.splice(i, 1);
            total--;
          }
        }
        that.setData({
          regardData: regardData,
          total: total
        })
      }
    });
  },
  // user_visit_log/deleteAll  清空
  delAll: function(e) {
    var that = this,
      delsub = this.data.subjectId;
    Trequest({
      url: 'user_visit_log/deleteAll',
      data: {
        subject_id: delsub
      },
      callback(res) {
        that.setData({
          regardData: [],
          total: 0
        })
      }
    });
  },
  // 上拉加载
  onReachBottom: function() {
    let that = this,
      ifLoad = this.data.ifLoad,
      page = this.data.pageNum,
      a = this.data.total / this.data.numPerPage;
    if (ifLoad == true) {
      if (page < a) {
        page++;
        let params = {
          subject_id: that.data.subjectId,
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
  },

  //回到顶部
  goTop: function (e) { // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
      this.setData({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  scroll: function (e, res) {
    // 容器滚动时将此时的滚动距离赋值给 this.data.scrollTop
    if (e.detail.scrollTop > 100) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  }
})