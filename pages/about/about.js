const Trequest = require('../../static/js/request.js');
var n = getApp(),
  e = require("../../wxParse/wxParse.js");
Page({
  data: {},
  onLoad: function(options) {
    // if (!options.id) {
    //   wx.navigateBack();
    //   return false;
    // }
    var that = this;
    Trequest({
      url: 'article/detail',
      data: {
        id: options.id
      },
      callback(t) {
        // console.log(t);
        wx.setNavigationBarTitle({
          title: t.data.title
        });
        e.wxParse("content", "html", t.data.content, that, 5);
      }

    });
  },
})