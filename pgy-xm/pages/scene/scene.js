// pages/scene/scene.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid:'',
    did:'',
    sceneList:[],
  },
  goPage: function () {
    wx.navigateTo({
      url: '../establish/establish'
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
    let that = this;
    wx.setStorage({
      key: 'sence',
      data: {},
    })
    wx.getStorage({
      key: 'did',
      success: function (res) {
        console.log(res)
        that.setData({
          did: res.data,
        })
      }
    });
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        console.log(res)
        that.setData({
          uid: res.data,          
        })
        that.loadList()        
      }
    });        
  },
  loadList:function(){
    let that = this;
    wx.sendSocketMessage(
      {
        data: JSON.stringify({
          "op": "scene",
          "act": "list",
          "uid": that.data.uid,
          "did": that.data.did,
        })
      })
    wx.onSocketMessage(function (res) {
      console.log(JSON.parse(res.data));
      that.setData({
        sceneList: JSON.parse(res.data).msg
      })
    })
  },
  gosence:function(e){
    console.log(e.currentTarget.dataset.obj)
    wx.setStorage({
      key: 'sence',
      data: e.currentTarget.dataset.obj,
    })
    wx.navigateTo({
      url: '../establish/establish?type=updata',
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