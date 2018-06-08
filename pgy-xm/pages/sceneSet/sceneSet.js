// pages/sceneSet/sceneSet.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    obj:{},
    value:'',
    time:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getStorage({
      key: 'obj',
      success: function (res) {
        that.setData({
          obj: res.data
        })
        console.log(res.data)
      }
    })
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
  
  },
  changeValue: function (e) {
    console.log(e)
    this.setData({
      value: e.currentTarget.dataset.str
    })
  },
  setValue: function (e) {
    console.log(e)
    this.setData({
      value: e.detail.value
    })
  },
  setTime:function(e){
    console.log(e)
    this.setData({
      time: e.detail.value
    })
  },
  consevres:function(){
    let han = /^[\u4e00-\u9fa5]+$/;
    let str = this.data.value;
    let that = this;
    let time = this.data.time;    
    if(time == ''){
      wx.showModal({
        title: '提示',
        content: '执行下个动作时间不可为空，如没有下个动作请将时间设置为1',
      })
    } else if (parseInt(time) < 1 || parseInt(time) > 300){
      wx.showModal({
        title: '提示',
        content: '执行下个动作时间不可少于1秒,或者大于300秒',
      })
    }else{
      if (!han.test(str)) {
        console.log(11111)
        wx.showModal({
          title: '提示',
          content: '管家执行的动作只能输入中文字符',
        })
      } else {
        console.log(22222)                      
        wx.getStorage({
          key: 'sence',
          success: function(res) {
            let sence = res.data;
            let tts = ''
            sence.action = sence.action ? sence.action:[];
            if (that.data.obj.id == 'voice') {
              tts = 'tts' 
            }
            sence.action.push({
              name:str,
              time:time,
              tts:tts?tts:''
            })
            wx.setStorage({
              key: 'sence',
              data: sence,
            })
          },
          fail:function(){
            let sence = {};
            sence.action = sence.action ? sence.action : [];
            let tts = ''
            if (that.data.obj.id == 'voice') {
              tts = 'tts'
            }
            sence.action.push({
              name: str,
              time: time,
              tts: tts ? tts : ''
            })
            wx.setStorage({
              key: 'sence',
              data: sence,
            })
          },
        })    
      }
    }
    
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