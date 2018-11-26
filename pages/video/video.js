// pages/video/video.js
let AppMusic = wx.getBackgroundAudioManager();
const Trequest = require('../../static/js/request.js')
var n = getApp(),
  e = require("../../wxParse/wxParse.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    level: 0,
    collection_id: 0,
    collection_free: 0,
    videoSrc: '',
    avatar: [],
    avatarLen: 0,
    videoCount: '0',
    videoDetail: 'block',
    follow: 0,
    title: '',
    currentCount: 0,
    allCount: 0,
    nowPrice: 0,
    price: 0,
    currentTab: 0,
    goodsItem: [],
    options: '',
    subjectId: '',
    coverImgUrl: '',
    walkmanPlay: {
      walkmanState: 'none',
      title: '',
      current: '0.0',
      time: '0.0',
      audioPress: '0',
      playicon: 'playing',
      src: ''
    },
    speed: 1,
    isAudio: false,
    prevIndex: 0,
    nextIndex: 0,
    currentIndex: 0,
    audioData: {} //音频数据
  },
  onShow: function() {
    var that = this,
      str = '',
      userInfo = wx.getStorageSync('user_info').data || '';
    if (userInfo) {
      if (userInfo.userVip) {
        that.setData({
          level: userInfo.userVip.level
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.auth) {
      wx.setStorageSync("state", options.auth);
    }
    if (!options.id) {
      wx.navigateBack();
      return false;
    }
    var that = this,
      str = '',
      userInfo = wx.getStorageSync('user_info').data || '';
    if (userInfo) {
      if (userInfo.userVip) {
        that.setData({
          level: userInfo.userVip.level
        })
      }
    }
    for (let i in options) {
      if (i != 'pageAs') {
        // if (str == '') {
        //   str += '?' + i + '=' + options[i];
        // } else {
          str += '&' + i + '=' + options[i];
        // }
      }
    }
    that.setData({
      collection_id: options.id,
      options: str
    })

    that.visitLog();

    // 获取课程信息
    Trequest({
      url: 'goods/getlist',
      data: {
        id: that.data.collection_id
      },
      callback(res) {
        that.setData({
          subjectId: res.data.data[0].subject_id,
          coverImgUrl: res.data.data[0].pic_url,
          collection_free: res.data.data[0].is_free
        })

        if (res.data.data[0].video_url) {
          that.setData({
            'videoSrc': res.data.data[0].video_url
          })
        } else {
          that.setData({
            videoSrc: ''
          })
        }
        that.setData({
          goodsItem: res.data.data[0].goodsItem,
          title: res.data.data[0].title,
          videoCount: res.data.data[0].learn_times_text,
          follow: res.data.data[0].is_collected
        })
        e.wxParse("content", "html", res.data.data[0].content, that, 5);

      }
    });

  },
  visitLog: function() {
    var that = this;
    // user_visit_log/getlist   numPerPage=5    subject_id =    课程ID 获取课程学习头像列表
    Trequest({
      url: 'user_visit_log/getlist',
      data: {
        numPerPage: 5,
        real_subject_id: that.data.collection_id
      },
      callback(res) {
        that.setData({
          avatar: res.data.data
        })
        that.setData({
          avatarLen: that.data.avatar.length
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
    console.log('播放', e.currentTarget.dataset)
    var current = e.currentTarget.dataset.current;
    this.setData({
      currentIndex: current
    });
    this.creatAudioData();
  },
  // 播放上一课时 goodsItem
  playPrev: function(e) {
    var current = e.currentTarget.dataset.current;
    if (current > 0) {
      current--;
      this.setData({
        currentIndex: current
      });
      this.creatAudioData();
    }
  },
  // 播放下一课时
  playNext(e) {
    var current = e.currentTarget.dataset.current,
      len = this.data.goodsItem.length;
    if (current < len - 1) {
      current++;
      this.setData({
        currentIndex: current
      });
      this.creatAudioData();
    }
  },
  creatAudioData: function() {
    let index = this.data.currentIndex;
    let audioData = {};
    audioData.coverimgurl = this.data.coverImgUrl;
    audioData.video = this.data.goodsItem[index].video_url;
    audioData.title = this.data.goodsItem[index].title;
    audioData.goodsid = this.data.goodsItem[index].id;
    audioData.subject = this.data.subjectId;
    audioData.src = this.data.goodsItem[index].radio_url;
    audioData.free = this.data.goodsItem[index].is_free;
    this.setData({
      audioData: audioData
    })
    let dataset = audioData;
    // 课时是否免费
    if (dataset.free || this.data.level > 0) {
      // 添加最近学习记录
      this.addLearn(dataset.goodsid);
      //判断是否是绘本
      if (dataset.subject == 4) {
        wx.navigateTo({
          url: '/pages/picturebook/picturebook?gi_id=' + dataset.goodsid
        })
      } else if (dataset.video) {
        // 判断是否是视频
        this.setData({
          'videoSrc': dataset.video
        })
        // console.log('播放按钮');
        this.videoContext.play();
        // this.videoContext.requestFullScreen();
      } else if (dataset.src) {
        // 获取当前选择的音频信息
        this.setData({
          'isAudio': true,
          'coverImgUrl': dataset.coverimgurl,
          'walkmanPlay.title': dataset.title,
          'walkmanPlay.src': dataset.src,
          'walkmanPlay.time': '0:0',
          'walkmanPlay.current': '0:0',
          'walkmanPlay.playicon': 'playing',
          'walkmanPlay.walkmanState': 'block'
        })
        this.createAudio();
        AppMusic.play();
      }
    } else {
      var that = this,
        userInfo = wx.getStorageSync('user_info').data || '';
      if (userInfo) {
        wx.showModal({
          title: '',
          content: '请先加入会员！',
          success: function(res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/mine-vip/mine-vip'
              })
            } else if (res.cancel) {}
          }
        });
      } else {
        wx.showModal({
          title: '',
          content: '请先登录！',
          success: function(res) {
            if (res.confirm) {
              wx.redirectTo({
                url: "/pages/login/login?pageAs=video" + that.data.options
              });
              return false;
            } else if (res.cancel) {}
          }
        });
      }
    }
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
        len = this.data.goodsItem.length;
      if (current < len - 1) {
        current++;
        this.setData({
          currentIndex: current
        });
        this.creatAudioData();
      } else {
        this.setData({
          'isAudio': false
        });
      }
    })

    AppMusic.onError((res) => {
      // console.log(res.errMsg);
      // console.log(res.errCode);
      wx.showToast({
        title: '播放出错了，请重试',
        icon: 'none'
      });
      this.setData({
        'isAudio': false
      });
    })
    AppMusic.onPrev(() => {
      // console.log('点击了上一首');
      var current = this.data.currentIndex;
      if (current > 0) {
        current--;
        this.setData({
          currentIndex: current
        });
        this.creatAudioData();
      }
    })
    AppMusic.onNext(() => {
      // console.log('点击了下一首');
      var current = this.data.currentIndex,
        len = this.data.goodsItem.length;
      if (current < len - 1) {
        current++;
        this.setData({
          currentIndex: current
        });
        this.creatAudioData();
      }
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.videoContext = wx.createVideoContext('myVideo')
  },
  playFn: function() {
    // 视频播放时
    this.setData({
      videoDetail: 'none'
    })
  },
  // cashBuy: function() {
  //   console.log('余额购买');
  // },
  // openVip: function() {
  //   console.log('开通会员');
  // },
  followFn: function() {
    var that = this,
      userInfo = wx.getStorageSync('user_info').data || '';
    if (!userInfo) {
      wx.redirectTo({
        url: "/pages/login/login?pageAs=video" + that.data.options
      });
      return false;
    }
    // 收藏
    Trequest({
      url: 'collection/toggle',
      data: {
        collection_id: that.data.collection_id,
      },
      callback(res) {
        // console.log(res);
        if (res.data.code == 0) {
          that.setData({
            follow: !that.data.follow
          });
        }
      }
    });
  },
  errFn: function(e) {
    // 视频出错时
    console.log(e);
  },
  //滑动切换
  swiperTab: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  //点击切换
  clickTab: function(e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  onShareAppMessage: function() {
    var that = this,
      str = '',
      auth = '',
      userInfo = wx.getStorageSync('user_info').data || '';
    str = userInfo && userInfo.nickname ? userInfo.nickname : '';
    auth = userInfo && userInfo.auth ? userInfo.auth : '';
    // console.log('/pages/video/video' + this.data.options + '&auth=' + auth);
    // 分享按钮
    return {
      title: '您的好友' + str + ',邀请您一起学英语！',
      desc: '',
      path: '/pages/video/video' + this.data.options + '&auth=' + auth
    }
  },
  // 添加学习记录   goods_item/ learning    id=课时的ID
  addLearn: function(id) {
    var that = this;
    Trequest({
      url: 'user_visit_log/add',
      data: {
        gi_id: id
      },
      callback(res) {
        var videoCount = that.data.videoCount + 1;
        that.setData({
          videoCount: videoCount
        })
      }
    });
  },
  SpeedDown: function(e) {
    // 1.0 1.25  1.5  0.5 0.8
    var speed = e.target.dataset.speed;
    switch (speed) {
      case 1.0:
        speed = 0.8;
        break;
      case 1.25:
        speed = 1.0;
        break;
      case 1.5:
        speed = 1.25;
        break;
      case 0.5:
        speed = 0.5;
        break;
      case 0.8:
        speed = 0.5;
        break;
      default:
        speed = 1.0;
        break;
    }
    this.setData({
      speed: speed
    })
    speed = parseFloat(speed);
    this.videoContext.playbackRate(speed);
  },
  SpeedUp: function(e) {
    var speed = e.target.dataset.speed;
    switch (speed) {
      case 1.0:
        speed = 1.25;
        break;
      case 1.25:
        speed = 1.5;
        break;
      case 1.5:
        speed = 1.5;
        break;
      case 0.5:
        speed = 0.8;
        break;
      case 0.8:
        speed = 1.0;
        break;
      default:
        speed = 1.0;
        break;
    }
    this.setData({
      speed: speed
    })
    speed = parseFloat(speed);
    this.videoContext.playbackRate(speed);
  }

})