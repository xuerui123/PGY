// pages/myhome/myhome.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid:'',
    did:'',
    list:[]
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
    wx.getStorage({
      key: 'did',
      success: function (res) {
        that.setData({
          did: res.data,
        })
      }
    });
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          uid: res.data,
        })
        that.loadRobotList()
      }
    });
  },
  loadRobotList: function () {
    let that = this;
    wx.sendSocketMessage(
      {
        data: JSON.stringify({
          "op": "mysys",
          "act": "listrobot",
          "uid": that.data.uid,
          "did": that.data.did,
        })
      })
    wx.onSocketMessage(function (res) {
      console.log(JSON.parse(res.data))
      that.setData({
        list: JSON.parse(res.data).msg
      })
    })
  },
  del:function(e){
    let that =this;
    wx.showModal({
      title: '提示',
      content: '确认解绑该设备',
      success:function(res){
        if(res.confirm){
          wx.sendSocketMessage(
            {
              data: JSON.stringify({
                "op": "mysys",
                "act": "delsysinfo",
                "uid": that.data.uid,
                "did": that.data.did,
                date: {
                  did: e.currentTarget.dataset.id
                }
              })
            })
          wx.onSocketMessage(function (res) {
            console.log(JSON.parse(res.data))
            that.loadRobotList()
          })
        }
      }
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