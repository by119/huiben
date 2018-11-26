// pages/tape.js
const Trequest = require('../../static/js/request.js');
var innerAudio = wx.createInnerAudioContext(); //音频
const recorderManager = wx.getRecorderManager() //录音
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tapeData: '',
    tapeTxt: '长按开始录音',
    canPlay: true, //可以播放音频
    hornCss:'',
    playIcon: 'play', //播放录音按钮状态
    playState: false, //播放录音按钮显隐
    tapeCss: '', //录音播放时按钮的样式
    longTapState: false, //是否长按录音按钮
    src: '', //录音音频临时路径
    tapeIds: '', //已经读取过的文章id字符串
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.setStorageSync('tape_ids', '');
    Trequest({
      url: 'goods_item_segment/getlist',
      data: {
        gi_id: 21,
        numPage: 1
      },
      callback(t) {
        that.setData({
          tapeData: t.data.data[0],
          id: t.data.data[0].id, //-----------------------
        })
      }
    });
    // 音乐播放器
    innerAudio.autoplay = false;
  },
  // 播放音频
  playRadio() {
    if (this.data.canPlay == false) {
      return false;
    }
    this.setData({
      canPlay: false,
      hornCss: 'horn-css'
    })
    innerAudio.destroy();
    innerAudio = wx.createInnerAudioContext();
    innerAudio.src = this.data.tapeData.radio_url;
    innerAudio.autoplay = true;
    this.createAudio();
    innerAudio.play();
  },
  //播放音频
  createAudio: function() {
    innerAudio.onCanplay(() => {
      // console.log('进入可以播放状态');
    })
    innerAudio.onPlay(() => {
      // console.log('开始播放');
    })
    innerAudio.onTimeUpdate(() => {
      // console.log('正在播放');
    })
    innerAudio.onPause(() => {
      // console.log('暂停播放');
    })
    innerAudio.onStop(() => {
      // console.log('停止播放');
      //停止播放，销毁该实例
      innerAudio.destroy();
    })
    innerAudio.onEnded(() => {
      // console.log('音频播放结束');
      //播放结束，销毁该实例
      this.setData({
        canPlay: true,
        hornCss: ''
      })
      innerAudio.destroy();
    })
    innerAudio.onError((res) => {
      // console.log(res.errMsg);
      // console.log(res.errCode);
      wx.showToast({
        title: res.errMsg,
        icon: 'none'
      });
      innerAudio.destroy();
    })
  },
  // 换一组内容
  changeTape() {
    var that = this,
      tapeIds = wx.getStorageSync('tape_ids') ? wx.getStorageSync('tape_ids') : '';
    tapeIds = tapeIds == '' ? that.data.id+'' : tapeIds + ',' + that.data.id;
    tapeIds = this.distinct(tapeIds.split(','));
    tapeIds = tapeIds.join(',');
    wx.setStorageSync('tape_ids', tapeIds)
    Trequest({
      url: 'goods_item_segment/getlist',
      data: {
        gi_id: 21,
        numPage: 1,
        ids: tapeIds,
        order_by: 'rand()'
      },
      callback(t) {
        if (t.data.data[0]) {
          that.setData({
            tapeData: t.data.data[0],
            id: t.data.data[0].id
          })
        }
      }
    });
  },
  // 点击录音按钮
  tapeTap() {
    // 停止播放音频
    innerAudio.destroy();
    this.setData({
      canPlay: true,
      hornCss: '',
    })
    wx.showToast({
      title: '时间太短，请重试',
      icon: 'none'
    })
  },
  // 长按录音按钮
  playReord() {
    this.setData({
      tapeTxt: '录音中',
      tapeCss: 'tape-css',
      longTapState: true
    })
    this.createRecord();
    const options = {
      duration: 10000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3',
      frameSize: 50
    }
    recorderManager.start(options);
  },
  // 松开录音
  stopRecord() {
    if (this.data.longTapState) {
      recorderManager.stop();
    }
    this.setData({
      longTapState: false
    })
  },
  // 播放录音
  playTape() {
    // 将图标变为播放中按钮
    if (this.data.playIcon == 'play' && this.data.tapeTxt == '点击继续播放') {
      this.setData({
        playState: true,
        playIcon: 'playing',
        tapeTxt: '播放中',
        tapeCss: ''
      })
      innerAudio.play();
      return false;
    }
    if (this.data.playIcon == 'playing') {
      this.setData({
        playState: true,
        playIcon: 'play',
        tapeTxt: '点击继续播放',
        tapeCss: ''
      })
      innerAudio.pause();
      return false;
    }
    this.setData({
      playState: true,
      playIcon: 'playing',
      tapeTxt: '播放中',
      tapeCss: ''
    })
    innerAudio.destroy();
    innerAudio = wx.createInnerAudioContext();
    innerAudio.src = this.data.src;
    innerAudio.autoplay = true;
    this.createAudio2();
    innerAudio.play();
  },
  // 重录
  rerecord() {
    this.setData({
      playState: false,
      playIcon: 'play',
      tapeTxt: '长按开始录音',
      tapeCss: ''
    })
  },
  // 设置录音事件
  createRecord() {
    let that = this;
    recorderManager.onStart(() => {
      // console.log('recorder start')
    })
    recorderManager.onPause(() => {
      // console.log('recorder pause')
    })
    recorderManager.onStop((res) => {
      // console.log('recorder stop', res)
      that.setData({
        src: res.tempFilePath
      })
      // 将图标变为播放录音按钮
      that.setData({
        playState: true,
        playIcon: 'play',
        tapeTxt: '点击开始播放',
        tapeCss: ''
      })
    })
    recorderManager.onError(function(res) {
      // 录音失败的回调处理 将图标变回录音按钮
      wx.showToast({
        title: res.errMsg,
        icon: 'none'
      })
      that.setData({
        playState: false,
        tapeTxt: '长按开始录音',
        tapeCss: ''
      })
    })
    recorderManager.onFrameRecorded((res) => {
      // const {
      //   frameBuffer
      // } = res
      // console.log('frameBuffer.byteLength', frameBuffer.byteLength)
    })
  },
  // 播放录音音频
  createAudio2: function() {
    innerAudio.onCanplay(() => {
      // console.log('进入可以播放状态');
    })
    innerAudio.onPlay(() => {
      // console.log('开始播放');
    })
    innerAudio.onTimeUpdate(() => {
      // console.log('正在播放');
    })
    innerAudio.onPause(() => {
      // console.log('暂停播放');
    })
    innerAudio.onStop(() => {
      // console.log('停止播放');
      //停止播放，销毁该实例
      innerAudio.destroy();
    })
    innerAudio.onEnded(() => {
      // console.log('音频播放结束');
      //播放结束，销毁该实例
      this.setData({
        playState: true,
        playIcon: 'play',
        tapeTxt: '点击开始播放',
        tapeCss: ''
      })
      innerAudio.destroy();
    })
    innerAudio.onError((res) => {
      // console.log(res.errMsg);
      // console.log(res.errCode);
      wx.showToast({
        title: res.errMsg,
        icon: 'none'
      });
      innerAudio.destroy();
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    // 关闭音频
    innerAudio.stop();
    // 暂停音频
    // innerAudio.pause();
  },

  distinct: function(a) {
    // 数组去重
    var arr = a,
      i,
      j,
      len = arr.length;
    for (i = 0; i < len; i++) {
      for (j = i + 1; j < len; j++) {
        if (arr[i] == arr[j]) {
          arr.splice(j, 1);
          len--;
          j--;
        }
      }
    }
    return arr;
  },
})