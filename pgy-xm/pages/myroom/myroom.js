// pages/myroom/myroom.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid:'',
    did:'',
    roomList:[]
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
          roomCategoryList: []
        })
        that.loadroom();
      }
    });    
  },
  gopage:function(e){
    console.log(e.currentTarget.dataset.str);
    let page = e.currentTarget.dataset.str
    wx.navigateTo({
      url: '../' + page + '/' + page
    })
  },
  loadroom: function () {
    let that = this;
    wx.sendSocketMessage(
      {
        data: JSON.stringify({
          "op": "room",
          "act": "list",
          "uid": that.data.uid,
          "did": that.data.did,
        })
      })
    wx.onSocketMessage(function (res) {
      console.log(JSON.parse(res.data));
      that.setData({
        roomList: JSON.parse(res.data).msg
      })
    })
  },
  updataroom:function(e){
    console.log(e.currentTarget.dataset.str);
    let i = e.currentTarget.dataset.str
    let room = this.data.roomList[i]
    console.log(room)
    wx.navigateTo({
      url: '../addroom/addroom?name='+room.name+'&id='+room.id
    })
  },
  dele: function (e) {
    console.log(e.currentTarget.dataset.roomindex);
    let i = e.currentTarget.dataset.roomindex;
    let room = this.data.roomList[i]
    console.log(room)
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确认删除该房间',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.sendSocketMessage(
            {
              data: JSON.stringify({
                "op": "room",
                "act": "del",
                "uid": 'oNpl_wVYukIxDCvXQsTgKYnTiasU',
                "did": "30373331323031313164313830303737",
                "date": {
                  "roomid": room.id,
                  "roomname": room.name
                }
              })
            })
          wx.onSocketMessage(function (res) {
            console.log(JSON.parse(res.data));
            if (JSON.parse(res.data).ack==1){
              that.loadroom() 
            }
          })
        } else {
          console.log('用户点击取消')
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