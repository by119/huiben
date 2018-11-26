const Trequest = require('../../static/js/request.js')
let AppMusic = wx.getBackgroundAudioManager();

Page({
  data: {
    seachVal: '',
    currentTab: 0,
    images: [],
    swiperTab: [],
    navList: [],
    hotList: [],
    vipList: [],
    studyList2: [],
    studyList3: [],
    // studyList4: [],
    imgUrls: [],
    //默认
    current1: 0,
    walkmanList: [],
    // 音乐播放器
    playicon: 'play',
    audioPress: 0,
    walkmanState: 'none',
    walkmanImg: '',
    walkmanPlay: {},
    currentIndex:0,//当前播放的随身听下标
    // 模态框显隐
    modalState: false,
    modalList: [],
    englishList: [] //英语阅读

  },
  // 模态框控制
  closeActModal: function() {
    this.setData({
      modalState: !this.data.modalState
    })
  },
  onShow: function() {
    var userInfo = wx.getStorageSync('user_info').data || '';
    if (userInfo) {
      let tag = wx.getStorageSync('tag') || '';
      if (tag == '') {
        // 获取用户当前设置的标签
        Trequest({
          url: 'user_tag/getlist',
          data: {},
          callback(res) {
            if (res.data.total <= 0) {
              wx.navigateTo({
                url: '/pages/preference/preference',
              })
              return false;
            }
          }
        });
      }
    }

    var time = wx.getStorageSync("time") / 1000 || 0;
    Trequest({
      url: 'article/unreadCount',
      data: {
        time: time
      },
      callback(res) {
        // console.log(res,res.data);
        if (res.data > 0) {
          // 底部tabbar显示的上标
          wx.setTabBarBadge({
            index: 1,
            text: res.data.toString()
          });
        }
      }
    });
  },
  onLoad: function(options) {
    // console.log(options,'options');
    if (options.auth) {
      wx.setStorageSync("state", options.auth);
    }
    var that = this;
    // 头部tab
    Trequest({
      url: 'goods_category/cates',
      data: {},
      callback(res) {
        // console.log(res);
        // that.cates(res.data[0].id);
        var arr = [{
          id: 0,
          name: '精选'
        }];
        var len = res.data.length;
        for (var i = 0; i < len; i++) {
          arr.push(res.data[i]);
        }
        that.setData({
          swiperTab: arr
        })
      }
    });
    // 首页分类  1：轮播图    2：广告标题  3：热门精品   4： 新会员专属区  5:首页广告弹窗
    Trequest({
      url: 'adv/getlist',
      data: {
        type: '1,2,3,4,5',
        classified: 1
      },
      callback(res) {
        that.setData({
          imgUrls: res.data['1'],
          navList: res.data['2'].splice(0, 10),
          hotList: res.data['3'],
          vipList: res.data['4']
        })
        if (res.data['5']) {
          that.setData({
            modalList: res.data['5'][0],
            modalState: true
          })
        }
      }
    });


    // 底部列表  2：视频   3： 听  4：读
    Trequest({
      url: 'goods/index',
      data: {},
      callback(res) {
        // console.log(res.data[3], res.data[3].slice(0, 1) ,'底部列表');
        that.setData({
          studyList2: res.data[2],
          studyList3: res.data[3].slice(0, 4),
          // studyList4: res.data[4]
        })
      }
    });

    // 广告分类
    Trequest({
      url: 'adv/getlist',
      data: {
        type: 2
      },
      callback(res) {
        // console.log(res);
      }
    });
    // 课程 随身听
    Trequest({
      url: 'goods/getlist',
      data: {
        id: 2,
        p: 1,
        numPerPage: 2
      },
      callback(res) {
        // console.log(res);
        let list = [];
        for (var i = 0; i < res.data.data[0].goodsItem.length; i++) {
          // 保留两条随身听音频
          if (i < 2) {
            list.push(res.data.data[0].goodsItem[i]);
          }
        }
        that.setData({
          walkmanImg: res.data.data[0].pic_url,
          'walkmanList': list
        })
      }
    });
    // 英文阅读  
    Trequest({
      url: 'article/getlist',
      data: {
        category_id: 4,
        p: 1,
        numPerPage: 5
      },
      callback(res) {
        let englishList = res.data.data;
        that.setData({
          englishList: englishList
        })
      }
    });
  },

  // 隐藏页面
  onHide: function() {
    // 关闭音频
    // AppMusic.stop();
    // 暂停音频
    // AppMusic.pause();
    // 关闭广告弹窗

    // 退出页面隐藏弹出框广告
    // this.setData({
    //   modalState: false
    // })
  },
  // 随身听列表选择播放
  palyMusic: function(e) {
    // console.log('选择播放');
    // 获取当前选择的音频信息
    var dataset = e.currentTarget.dataset;
    this.setData({
      currentIndex: dataset.current
    })
    this.creatAudioData();
  },
  creatAudioData() {
    let index = this.data.currentIndex,
      walkmanList = this.data.walkmanList[index];
    console.log(this.data.walkmanList[index].title,index);
    this.setData({
      'walkmanPlay.poster': this.data.walkmanImg,
      'walkmanPlay.name': walkmanList.title,
      'walkmanPlay.src': walkmanList.radio_url,
      'walkmanPlay.time': '0:0',
      'walkmanPlay.current': '0:0'
    })
    this.createAudio();
    this.setData({
      playicon: 'playing',
      walkmanState: 'block'
    })
    AppMusic.play();
  },
  // 随身听播放控制
  _iconPlay: function() {
    if (this.data.playicon == "play") {
      AppMusic.play();
      this.setData({
        'playicon': 'playing'
      })
    } else {
      AppMusic.pause();
      this.setData({
        'playicon': 'play'
      })
    }
  },
  // 关闭停止随身听
  _iconStop: function() {
    AppMusic.stop();
    this.setData({
      'walkmanState': 'none'
    })
  },
  toSearch: function() {
    wx.navigateTo({
      url: '/pages/search/search',
    })
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
  changeIndicatorDots: function(e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  intervalChange: function(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function(e) {
    this.setData({
      duration: e.detail.value
    })
  },
  // tab左右切换事件
  bindchange: function(e) {
    this.setData({
      current1: e.detail.current
    })
  },
  createAudio: function() {
    AppMusic.title = this.data.walkmanPlay.name;
    AppMusic.coverImgUrl = this.data.walkmanPlay.poster;
    AppMusic.src = this.data.walkmanPlay.src; // 设置了 src 之后会自动播放
    AppMusic.onCanplay(() => {
      // console.log('进入可以播放状态');
      this.setData({
        'walkmanPlay.time': this.convertTime(AppMusic.duration),
        'walkmanPlay.current': this.convertTime(AppMusic.currentTime)
      })
    })
    AppMusic.onPlay(() => {
      // console.log('开始播放');
      this.setData({
        playicon: 'playing',
        'walkmanPlay.time': this.convertTime(AppMusic.duration),
        'walkmanPlay.current': this.convertTime(AppMusic.currentTime)
      })
    })
    AppMusic.onTimeUpdate(() => {
      // console.log('正在播放');
      this.setData({
        'walkmanPlay.time': this.convertTime(AppMusic.duration),
        'walkmanPlay.current': this.convertTime(AppMusic.currentTime),
        audioPress: Math.ceil(AppMusic.currentTime / AppMusic.duration * 100)
      })
    })
    AppMusic.onPause(() => {
      // console.log('暂停播放');
      this.setData({
        playicon: 'play'
      })
    })
    AppMusic.onStop(() => {
      // console.log('停止播放');
      this.setData({
        walkmanState: 'none'
      })
      //停止播放，销毁该实例
    })
    AppMusic.onEnded(() => {
      // console.log('录音播放结束');
      this.setData({
        playicon: 'play'
      });
      //播放结束，有下一首播放下一首，否则关闭播放框
      var current = this.data.currentIndex,
        len = this.data.walkmanList.length;
      if (current < len - 1) {
        current++;
        this.setData({
          currentIndex: current
        });
        this.creatAudioData();
      } else {
        this.setData({
          'walkmanState': 'none'
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
        'walkmanState': 'none'
      });
    })
    AppMusic.onPrev(() => {
      // console.log('点击了上一首')
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
      // console.log('点击了下一首')
      //有下一首播放下一首，否则关闭播放框
      var current = this.data.currentIndex,
        len = this.data.walkmanList.length;
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
  },

  imageLoad: function(e) {
    var $width = e.detail.width, //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height; //图片的真实宽高比例
    //图片需要宽度
    var w;
    if (e.currentTarget.dataset.w) {
      w = Math.ceil(e.currentTarget.dataset.w);
    } else {
      w = $width
    }
    var viewWidth = w, //设置图片显示宽度
      viewHeight = w / ratio; //计算的高度值
    var image = this.data.images;
    //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
    image[e.target.dataset.index] = {
      width: viewWidth,
      height: viewHeight,
    }
    this.setData({
      images: image
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