Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    pageUrl: {
      type: String,
      value: ''
    },
    temp: {
      type: Number,
      value: 0
    },
    // 标题
    title: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '' // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    // 图片
    img: {
      type: String,
      value: ''
    },
    // 动态内容
    explain: {
      type: String,
      value: ''
    },
    // 上次学习时间
    time: {
      type: String,
      value: ''
    },
    delBtn: {
      type: String,
      value: 'none'
    },
    delId: {
      type: Number,
      value: 0
    },
    delSub: {
      type: Number,
      value: 0
    }
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {},

  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    /*
     * 公有方法
     */
    /*
     * 内部私有方法建议以下划线开头
     * triggerEvent 用于触发事件
     */

    _delFn(e) {
      this.triggerEvent("delFn", e.currentTarget.dataset);
    },
  }
})