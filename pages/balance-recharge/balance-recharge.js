
const Trequest = require('../../static/js/request.js')
Page({
  data: {},
  onLoad: function (options) {
    var that = this;
    Trequest({
      url: '',
      data: {},
      callback(res) {
        // console.log(res);
      }

    });
  },
})