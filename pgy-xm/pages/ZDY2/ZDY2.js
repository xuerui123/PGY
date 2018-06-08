// pages/ZDY2/ZDY2.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    equipmentObj:'',
    uid:'',
    did:'',
    yid:'',
    isgru:0,
    pt:1,
    btn:"",    
    commandVal:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      btn: options.btn,
      pt: options.pt,
      isgru:options.isgru
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
    let that = this;
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          uid: res.data
        })
      },
    })
    wx.getStorage({
      key: 'did',
      success: function (res) {
        that.setData({
          did: res.data
        })
      },
    })
    wx.getStorage({
      key: 'equipmentObj',
      success: function(res) {
        that.setData({
          equipmentObj:res.data,
          yid:res.data.yid
        })
      },
    })
  },
  command:function(e){
    console.log(e.detail.value)
    this.setData({
      commandVal: e.detail.value
    })
    
  },
  goBack:function(){
    let that =this;
    if (this.data.commandVal==''){
      wx.showModal({
        title: '提示',
        content: '语音命令不可为空',
      })
    } else if (this.data.commandVal.length>4){
      wx.showModal({
        title: '提示',
        content: '语音命令长度不能大于4位',
      })
    }else{
      wx.sendSocketMessage({
        data: JSON.stringify({
          "op": "device",
          "act": "study",
          "uid": that.data.uid,
          "did": that.data.did,
          "date": {
            "pt": 1,
            "isgru": 0,
            "remoid": that.data.equipmentObj.remoid,
            "dch": that.data.equipmentObj.dch,
            "dvcm": that.data.commandVal,
            "dkey": '',
            "yid": that.data.yid,
          }
        })
      })
      wx.onSocketMessage(function (res) {
        console.log(res)
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];
        if (that.data.btn == "AK1") {
          prevPage.setData({
            AK1: that.data.commandVal            
          })
          wx.navigateBack()
        } else if (that.data.btn == "AK2") {
          prevPage.setData({
            AK2: that.data.commandVal
          })
          wx.navigateBack()
        }
      })
    }      
  },
  choosePT:function(e){
    let that = this;
    let pt = e.currentTarget.dataset.pt
    if (that.data.btn == "AK1" || that.data.btn == "AK2"){
      wx.showModal({
        title: '提示',
        content: '标准面板无法选择该选项',
      })
    }else{
      this.setData({
        pt:pt
      })
    }
  },
  chooseIsgru: function (e) {
    let that =this;
    let isgru = e.currentTarget.dataset.isgru
    if (that.data.btn == "AK1" || that.data.btn == "AK2") {
      wx.showModal({
        title: '提示',
        content: '标准面板无法选择该选项',
      })
    } else {
      this.setData({
        isgru: isgru
      })
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