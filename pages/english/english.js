// pages/english/english.js
const Trequest = require('../../static/js/request.js')
const plugin = requirePlugin("WechatSI");
var n = getApp(),
  e = require("../../wxParse/wxParse.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showChinese: false,
    englishText:'',
    chineseText:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options, 'options')
    var that = this;
    Trequest({
      url: 'article/detail',
      data: {
        id: options.id
      },
      callback(res) {
        // res.data.data;
        // console.log(res.data, 'aaaa');
        let englishText = res.data.content;
        let chineseText = res.data.translation;
        e.wxParse("content", "html", englishText, that, 5);
        that.setData({
          englishText: englishText,
          chineseText: chineseText
        })
      }
    });
  },
  translate: function() {
    var that = this;
    var chineseText = this.data.chineseText;
    // console.log(e,'eee');
    // wx.showLoading({
    //   title: '翻译中',
    // })
    e.wxParse("content2", "html", chineseText, that, 5);
    // plugin.translate({
    //   lfrom: "en_US",
    //   lto: "zh_CN",
    //   content: this.data.englishText,
    //   success: function (res) {
    //     if (res.retcode == 0) {
    //       console.log("result", res.result)
    //       let englishText = res.result;
    //       e.wxParse("content2", "html", englishText, that, 5);
    //       that.setData({
    //         englishText: englishText
    //       })
    //       wx.hideLoading();
    //     } else {
    //       console.warn("翻译失败", res)
    //       wx.showToast({
    //         title: res.msg,
    //         icon: 'none'
    //       })
    //     }
    //   },
    //   fail: function (res) {
    //     console.log("网络失败", res)
    //     wx.showToast({
    //       title: res.msg,
    //       icon:'none'
    //     })
    //   }
    // });
    this.setData({
      showChinese: !this.data.showChinese
    });
  }
})