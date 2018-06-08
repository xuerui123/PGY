// pages/timing/timing.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    times: '00:00',
    flag: true,
    repeat: 1,
    week: [
      {
        day: "周日",
        num: 7
      },
      {
        day: "周一",
        num: 1,
        type: false
      },
      {
        day: "周二",
        num: 2,
        type: false
      },
      {
        day: "周三",
        num: 3,
        type: false
      },
      {
        day: "周四",
        num: 4,
        type: false
      },
      {
        day: "周五",
        num: 5,
        type: false
      },
      {
        day: "周六",
        num: 6,
        type: false
      }
    ]
  },
  showWeek: function (e) {
    this.setData({
      flag: true,
    })
  },
  choseRepeat: function (e) {
    let num = e.currentTarget.dataset.num;
    this.setData({
      repeat: num
    })
    if (num == 4) {
      if (this.data.flag) {
        this.setData({
          flag: false,
        })
      } else {
        this.setData({
          flag: true,
        })
      }
    }
  },
  bindStarTime: function (e) {
    console.log(e);
    let time = e.detail.value;
    this.setData({
      times: time
    })
  },
  choseWeek: function (e) {
    console.log(e.currentTarget.dataset.week);
    let i = e.currentTarget.dataset.week
    let week = this.data.week;
    
    if (week[i].type) {
      week[i].type = false
    } else {
      week[i].type = true
    }
    this.setData({
      week:week
    })
  },
  preserve:function(){
    let obj ={};
    obj.repeat = this.data.repeat;
    obj.time = this.data.times;  
    obj.date =  ''  
    if(obj.repeat==1){
      obj = {
        repeat: 0,
        mode: 1, 
        time : this.data.times,
        date: new Date().getFullYear() + '-' + parseInt(new Date().getMonth() + 1) + '-' + new Date().getDate()      
      }
    }else if(obj.repeat == 2){
      obj = {
        repeat: 1,
        mode: 2,
        date: '1,2,3,4,5',   
        time: this.data.times,     
      }
    }else if (obj.repeat == 3){
      obj = {
        repeat: 1,
        mode: 2,
        date: '1,2,3,4,5,6,7',
        time: this.data.times,        
      }
    }else if(obj.repeat==4){      
      let week = this.data.week;      
      for(let i = 0;i<week.length;i++){
        if(week[i].type){
          obj.date = obj.date + week[i].num+','
        }
      }
      obj.mode= 2
    }
    wx.getStorage({
      key: 'sence',
      success: function(res) {
        let sence = res.data;
        sence.date = obj.date;
        sence.mode = obj.mode;
        sence.repeat = obj.repeat;
        sence.time = obj.time;
        wx.setStorage({
          key: 'sence',
          data: sence,
        })
      },
      fail:function(){
        let sence = {};
        sence.date = obj.date;
        sence.mode = obj.mode;
        sence.repeat = obj.repeat;
        sence.time = obj.time;
        wx.setStorage({
          key: 'sence',
          data: sence,
        })
      }
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