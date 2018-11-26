// components/music-ctrl/music-ctrl.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    bottom: {
      type: Number,
      value: 2
    },
    walkmanState :{
      type:String,
      value:'none'
    },
    coverImgUrl:{
      type:String,
      value:''
    },
    singer:{
      type:String,
      value:''
    },
    epname:{
      type:String,
      value:''
    },
    current: {
      type: String,
      value: '0:0'
    },
    time: {
      type: String,
      value: '0:0'
    },
    audioPress: {
      type: Number,
      value: 0
    },
    playicon: {
      type: String,
      value: 'play'
    }
    
  },

  created() {
    
  },
  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    _iconStop() {
      this.triggerEvent("iconStop");
    },
    _iconPlay() {
      this.triggerEvent("iconPlay");
    },
  }
})
