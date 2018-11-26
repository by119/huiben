const Trequest = require('../../static/js/request.js');
let AppMusic = wx.getBackgroundAudioManager();
Page({
  data: {
    coverImgUrl: '',
    currentIndex: 0,
    lastTitle: '',
    lastList: [],
    lastIndex: 0,
    walkmanPlay: {
      walkmanState: 'none',
      title: '',
      current: '0.0',
      time: '0.0',
      audioPress: '0',
      playicon: 'playing',
      src: ''
    },
    walkmanData: []
  },
  onLoad: function(options) {
    // console.log('walkman');
    // goods_item  goods_id= 2  classified = 1
    var that = this;
    // 随身听
    Trequest({
      url: 'goods_item/getlist',
      data: {
        goods_id: 2,
        classified: 1,
      },
      callback(res) {
        // console.log(res.data);
        var data = res.data,
          lastList = [];
        for (let i in data) {
          lastList.push(i);
        }
        that.setData({
          walkmanData: data,
          lastList: lastList
        })
      }
    });
    // 
    Trequest({
      url: 'goods/getlist',
      data: {
        id: 2,
        no_item: 1,
      },
      callback(res) {
        that.setData({
          coverImgUrl: res.data.data[0].pic_url
        })
      }
    });
  },
  // 隐藏页面
  onUnload: function() {
    // 关闭音频
    // AppMusic.stop();
    // 暂停音频
    // AppMusic.pause();
  },
  // 随身听列表选择播放
  palyMusic: function(e) {
    // console.log('选择播放');
    // 获取当前选择的音频信息
    var dataset = e.currentTarget.dataset;
    this.setData({
      currentIndex: dataset.current,
      lastIndex: this.data.lastList.indexOf(dataset.last)
    })
    this.creatAudioData()
    // this.createAudio();
    // AppMusic.play();
  },

  creatAudioData() {
    let index = this.data.currentIndex,
      lastIndex = this.data.lastIndex,
      lastTitle = this.data.lastList[lastIndex],
      walkmanData = this.data.walkmanData[lastTitle][index];
    console.log(walkmanData, lastTitle, index, 'aaaaa');
    this.setData({
      'coverImgUrl': this.data.coverImgUrl,
      'walkmanPlay.title': walkmanData.title,
      'walkmanPlay.src': walkmanData.radio_url,
      'walkmanPlay.time': '0:0',
      'walkmanPlay.current': '0:0',
      'walkmanPlay.playicon': 'playing',
      'walkmanPlay.walkmanState': 'block',
      lastTitle: lastTitle
    })
    this.createAudio();
    AppMusic.play();
  },
  // 随身听播放控制
  _iconPlay: function() {
    if (this.data.walkmanPlay.playicon == "play") {
      AppMusic.play();
      this.setData({
        'walkmanPlay.playicon': 'playing'
      })
    } else {
      AppMusic.pause();
      this.setData({
        'walkmanPlay.playicon': 'play'
      })
    }
  },
  // 关闭停止随身听
  _iconStop: function() {
    // console.log('关闭')
    AppMusic.stop();
    this.setData({
      'walkmanPlay.walkmanState': 'none'
    })
  },

  createAudio: function() {
    AppMusic.title = this.data.walkmanPlay.title;
    AppMusic.coverImgUrl = this.data.coverImgUrl;
    AppMusic.src = this.data.walkmanPlay.src; // 设置了 src 之后会自动播放
    AppMusic.onCanplay(() => {
      // console.log('进入可以播放状态');
      this.setData({
        'walkmanPlay.time': this.convertTime(AppMusic.duration),
        'walkmanPlay.current': this.convertTime(AppMusic.currentTime),
        'walkmanPlay.audioPress': Math.ceil(AppMusic.currentTime / AppMusic.duration * 100)
      })
    })
    AppMusic.onPlay(() => {
      // console.log('开始播放');
      this.setData({
        'walkmanPlay.playicon': 'playing',
        'walkmanPlay.time': this.convertTime(AppMusic.duration),
        'walkmanPlay.current': this.convertTime(AppMusic.currentTime),
        'walkmanPlay.audioPress': Math.ceil(AppMusic.currentTime / AppMusic.duration * 100)
      })
    })
    AppMusic.onTimeUpdate(() => {
      // console.log('正在播放');
      this.setData({
        'walkmanPlay.time': this.convertTime(AppMusic.duration),
        'walkmanPlay.current': this.convertTime(AppMusic.currentTime),
        'walkmanPlay.audioPress': Math.ceil(AppMusic.currentTime / AppMusic.duration * 100)
      })
    })
    AppMusic.onPause(() => {
      // console.log('暂停播放');
      this.setData({
        'walkmanPlay.playicon': 'play'
      })
    })
    AppMusic.onStop(() => {
      // console.log('停止播放');
      this.setData({
        walkmanState: 'none'
      })
    })
    AppMusic.onEnded(() => {
      // console.log('录音播放结束');
      this.setData({
        'walkmanPlay.playicon': 'play'
      });
      //播放结束，有下一首播放下一首，否则关闭播放框
      var current = this.data.currentIndex,
        lastIndex = this.data.lastIndex,
        lastTitle = this.data.lastTitle,
        len = this.data.walkmanData[lastTitle].length,
        lastLen = this.data.lastList.length;
      if (current < len - 1) {
        current++;
        this.setData({
          currentIndex: current
        });
        this.creatAudioData();
      } else {
        if (lastIndex < lastLen - 1) {
          lastIndex++;
          this.setData({
            currentIndex: 0,
            lastTitle: this.data.lastList[lastIndex],
            lastIndex: lastIndex
          });
          this.creatAudioData();
        } else {
          this.setData({
            'walkmanPlay.walkmanState': 'none'
          });
        }
      }
    })
    AppMusic.onError((res) => {
      // console.log(res.errMsg,'aaa');
      // console.log(res.errCode);
      wx.showToast({
        title: '播放出错了，请重试',
        icon: 'none'
      });
      this.setData({
        'walkmanPlay.walkmanState': 'none'
      });
    })
    AppMusic.onPrev(() => {
      // console.log('点击了上一首');
      var current = this.data.currentIndex,
        lastIndex = this.data.lastIndex,
        lastTitle = this.data.lastTitle,
        len = this.data.walkmanData[lastTitle].length,
        lastLen = this.data.lastList.length;
      if (current > 0) {
        current--;
        this.setData({
          currentIndex: current
        });
        this.creatAudioData();
      } else {
        if (lastIndex > 0) {
          lastIndex--;
          lastTitle = this.data.lastList[lastIndex];
          len = this.data.walkmanData[lastTitle].length;
          current = len > 0 ? len - 1 : 0;
          this.setData({
            currentIndex: current,
            lastTitle: this.data.lastList[lastIndex],
            lastIndex: lastIndex
          });
          this.creatAudioData();
        }
      }
    })
    AppMusic.onNext(() => {
      // console.log('点击了下一首');
      var current = this.data.currentIndex,
        lastIndex = this.data.lastIndex,
        lastTitle = this.data.lastTitle,
        len = this.data.walkmanData[lastTitle].length,
        lastLen = this.data.lastList.length;
      if (current < len - 1) {
        current++;
        this.setData({
          currentIndex: current
        });
        this.creatAudioData();
      } else {
        if (lastIndex < lastLen - 1) {
          lastIndex++;
          this.setData({
            currentIndex: 0,
            lastTitle: this.data.lastList[lastIndex],
            lastIndex: lastIndex
          });
          this.creatAudioData();
        }
      }
    })
  },
  toSearch: function() {
    wx.navigateTo({
      url: '../search/search',
    })
  },
  convertTime: function(a) {
    var second = Math.floor(a % 60); //计算秒
    var minite = Math.floor((a / 60) % 60); //计算分
    var hour = Math.floor((a / 3600) % 24); //计算小时
    var day = Math.floor((a / 3600) / 24);
    var str = '';
    if (day) {
      day = day.toString() + ':';
    } else {
      day = '';
    }
    if (hour) {
      hour = hour.toString() + ':';
    } else if (day) {
      hour = '0:';
    } else {
      hour = '';
    }
    if (minite) {
      minite = minite.toString() + ':';
    } else {
      minite = '0:';
    }
    if (second) {
      second = second.toString();
    } else {
      second = '0';
    }
    str = day + hour + minite + second;
    return str;
  },
  // 获取滚动条当前位置
  onPageScroll: function(e) {
    if (e.scrollTop > 100) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  //回到顶部
  goTop: function(e) { // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  }
})