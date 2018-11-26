// pages/preference/preference.js
const Trequest = require('../../static/js/request.js');
Page({
  data: {
    color: ['#6BC18B', '#E46E69', '#F4A248', '#678FD1', '#EA8E9D', '#CBAD88'],
    list: [],
    addList: [],
    bdColor: [],
    bgColor: [],
    btnStr: '至少选择三个标签'
  },
  onLoad: function(options) {
    // tag/getlist   标签列表接口
    var that = this, color = this.data.color;
    Trequest({
      url: 'tag/getlist',
      data: {
        numPerPage:1000
      },
      callback(res) {
        that.setData({
          list: res.data.data
        })
        let list = that.data.list,
          bdColor = [],
          bgColor = [];
        for (var i = 0; i < list.length; i++) {
          bdColor.push(color[i % 6]);
          bgColor.push('#fff');
        }
        that.setData({
          bdColor: bdColor,
          bgColor: bgColor
        })
      }
    });
  },
  select(e) {
    let addList = this.data.addList,
      bdColor = this.data.bdColor,
      bgColor = this.data.bgColor,
      btnStr = this.data.btnStr,
      i = e.target.dataset.i,
      id = e.target.dataset.id;
    if (this.data.bdColor[i] == '#fff') {
      bdColor[i] = this.data.bgColor[i];
      bgColor[i] = '#fff';
      addList.splice(addList.indexOf(id), 1);
      if (addList.length <= 0) {
        btnStr = '至少选择三个标签'
      } else if (addList.length < 3) {
        btnStr = '还差' + (3 - addList.length) + '个标签哦'
      }else {
        btnStr=''
      }
      this.setData({
        bdColor: bdColor,
        bgColor: bgColor,
        addList: addList,
        btnStr: btnStr
      })
      return false;
    }
    if (this.data.bgColor[i] == '#fff') {
      bgColor[i] = this.data.bdColor[i];
      bdColor[i] = '#fff';
      addList.push(id);
      if (addList.length <= 0) {
        btnStr = '至少选择三个标签'
      } else if (addList.length < 3) {
        btnStr = '还差' + (3 - addList.length) + '个标签哦'
      } else {
        btnStr = ''
      }
      this.setData({
        bdColor: bdColor,
        bgColor: bgColor,
        addList: addList,
        btnStr: btnStr
      })
    }
  },
  saveTag(){
    // tag/userTag 设置用户标签接口 参数如下
    // tag_ids  选中的标签ID数组
    // user_id,sign
    var that = this, color = this.data.color;
    Trequest({
      url: 'user_tag/addAll',
      data: {
        tag_ids: this.data.addList.join(',')
      },
      callback(res) {
        wx.setStorageSync('tag', that.data.addList);
        wx.switchTab({
          url: '/pages/suggest/suggest',
        })
      }
    });
  }
})