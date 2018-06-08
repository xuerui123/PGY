// pages/establish/establish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startimes: '开始时间',
    endtimes: '结束时间',
    flag: true,
    listnum: 2,
    off:true,
    makeList: [
      {
        id: 'voice',
        name: '语音回复',
        pstr: '请输入您要管家说的话',
        list: [
          '欢迎主人回家', '主人辛苦了', '好的陛下', '主人一路顺风'
        ]
      },
      {
        id: 'furnishing',
        name: '智能家居',
        pstr: '请输入您要对管家做的事',
        list: [
          '打开客厅空调', '打开加湿器', '打开客厅窗帘', '关闭客厅筒灯'
        ]
      },
      {
        id:'music',
        name: '音乐',
        pstr: '请输入您要管家播放的歌曲',
        list: [
          '播放周杰伦的歌', '播放丑八怪', '播放张学友的祝福', '播放轻音乐'
        ]
      },
      { 
        id:'story',
        name: '故事',
        pstr: '请输入您要管家播放的故事',
        list: [
          '播放白雪公主的故事', '收听凯叔讲故事', '收听英语故事', '收听皮皮鲁讲故事'
        ]
      },
      {
        id:'weather',
        name: '天气',
        pstr: '请输入您要管家播放的天气',
        list: [
          '播报北京天气', '今天的天气', '播报明天的天气', '上海后天的天气'
        ]
      },
      {
        id:'journalism',
        name: '新闻',
        pstr: '请输入您要管家播放的新闻',
        list: [
          '播放新闻', '我想听新闻', '收听体育新闻', '我想听科技新闻'
        ]
      },
      {
        id:'radio',
        name: '电台',
        pstr: '请输入您要管家播放的电台',
        list: [
          '收听北京电台', '收听湖南潇湘之声', '收听国家电台', '收听音乐电台'
        ]
      },
      {
        id:'other',
        name: '其他',
        pstr: '请输入您要管家做的事',
        list: [
          '讲个笑话', '收听相声', '床前明月光', '恐龙是什么'
        ]
      }
    ],
    sence:{},
    ifList: [], 
    doList:[],
    promptNnum: 1,
    senceName:''
  },
  bindStarTime: function (e) {
    this.setData({
      startimes: e.detail.value
    })
  },
  bindEndTime: function (e) {
    this.setData({
      endtimes: e.detail.value
    })
  },
  changeSenceName:function(e){
    this.setData({
      senceName: e.detail.value
    })
  },
  showCondition: function (e) {
    let num = e.currentTarget.dataset.num
    if (this.data.flag) {
      this.setData({
        flag: false,
        listnum: num
      })
    } else {
      this.setData({
        flag: true,

      })
    }
  },
  nexus: function (e) {
    //选择满足条件其一或同时
    console.log(e.currentTarget.dataset.num)
    this.setData({
      promptNnum: e.currentTarget.dataset.num
    })
  },
  sceneSet: function (e) {
    console.log(e)
    
    let id = e.currentTarget.dataset.id;
    let list = this.data.makeList;
    console.log(id)
    console.log(list)
    let that=this;
    for (let i = 0; i < list.length; i++) {
      if (id == list[i].id) {
        if(this.data.off){
          that.setData({
            off: false
          })
          wx.setStorage({
            key: "obj",
            data: list[i],
            success: function () {
              that.setData({
                off:true
              })
              wx.navigateTo({
                url: '../sceneSet/sceneSet'
              })
            }
          })
        }
      }
    }
  },
  goPage:function(e){
    console.log(e)
    let str = e.currentTarget.dataset.page
    wx.navigateTo({
      url: '../'+str+'/'+str
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this ; 
    wx.getStorage({
      key: 'sence',
      success: function(res) {
        let ifList = [];
        let doList = [];
        if(!res.data.svc){

        }else{
          ifList = res.data.svc.split(',');
        }     
        if(!res.data.sev){

        }else{
          for (let i = 0; i < res.data.sev.length; i++) {
            console.log(res.data.sev[i].loca)
            let num = res.data.sev[i].num ? res.data.sev[i].num : ''
            let str = res.data.sev[i].loca + res.data.sev[i].name + res.data.sev[i].str + num;
            ifList.push(str)
          }
        } 
        if(!res.data.action){
          
        }else{
          doList = res.data.action;
        }       
        if(!res.data.time){

        }else{
          let str = ''
          let arr = res.data.date.split(',')
          for (let i= 0 ; i<arr.length;i++){
            if (arr[i] == 1) { arr[i] = '一' }
            else if (arr[i] == 2) { arr[i] = '二' 
            } else if (arr[i] == 3) { arr[i] = '三' 
            } else if (arr[i] == 4) { arr[i] = '四' 
            } else if (arr[i] == 5) { arr[i] = '五' 
            } else if (arr[i] == 6) { arr[i] = '六' 
            } else if (arr[i] == 7) { arr[i] = '日' 
            } 
          }
          console.log(arr.toString())
          let s = arr.toString()
          str = '定时周' + s.slice(0, s.length - 1) + '开启'
          ifList.push(str)
        }                 
        that.setData({
          ifList: ifList,
          doList: doList
        })
      },
    })
  },
  addSence:function(){
    let obj = {};
    let that = this;
    wx.getStorage({
      key: 'sence',
      success: function(res) {
        obj = res.data;
        let date = {
          sna:that.data.senceName,
          timearea: that.data.startime + '-' + that.data.endtime,
          svc: obj.svc ? obj.svc:'',
          sev:'',
          date:obj.date,
          repeat:obj.repeat,
          time:obj.time,
          sevc:obj.sevc,
          mode:obj.mode
        }
      },
    })

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})