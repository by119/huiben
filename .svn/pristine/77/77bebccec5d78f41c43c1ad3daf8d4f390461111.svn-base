// pages/nav-more/nav-more.js
const Trequest = require('../../static/js/request.js')
Page({
  data: {
    navList: []
  },
  onLoad: function(options) {
    let that = this;
    // 首页分类 type  1：轮播图    2：广告标题  3：热门精品   4： 新会员专属区  5:首页广告弹窗
    Trequest({
      url: 'adv/getlist',
      data: {
        type: '2',
        classified: 1
      },
      callback(res) {
        var list = res.data['2'];
        list.splice(9, 1);
        that.setData({
          navList: list,
        })
      }
    });
  }
})