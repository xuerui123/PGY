// pages/addroom/addroom.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roomList:['卧室','主卧','次卧','客厅','餐厅','书房','儿童房','阳台','厨房','卫生间','办公室'],
    roomName:'',
    roomId:'',
    uid:'',
    did:'',
    status:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if(!options.id){

    }else{
      console.log(22)
      this.setData({
        roomName: options.name,
        roomId: options.id,
        status:2
      })
    }
    
  },
  choseRoom:function(e){
    console.log(e.currentTarget.dataset.str)
    this.setData({
      roomName: e.currentTarget.dataset.str
    })
  },
  setRoomName:function(e){
    console.log(e)
    this.setData({
      roomName:e.detail.value
    })
  },
  add:function(){
    let that = this;
    let status = that.data.status;
    console.log(status)
    if(!this.data.roomName){
      wx.showModal({
        title: '提示',
        content: '请先输入文字信息',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else {
            console.log('用户点击取消')
          }
        }
      })      
    }else{
      if(status==1){
        wx.sendSocketMessage(
          {
            data: JSON.stringify({
              "op": "room",
              "act": "add",
              "uid": that.data.uid,
              "did": that.data.did,
              "date": {
                "roomname": that.data.roomName
              }
            })
          })
        wx.onSocketMessage(function (res) {
          console.log(JSON.parse(res.data));
          if (JSON.parse(res.data).ack == 1) {
            wx.navigateBack()
          }
        })
      }else{
        wx.sendSocketMessage(
          {
            data: JSON.stringify({
              "op": "room",
              "act": "update",
              "uid": that.data.uid,
              "did": that.data.did,
              "date": {
                "roomname": that.data.roomName,
                "roomid": that.data.roomId,
              }
            })
          })
        wx.onSocketMessage(function (res) {
          console.log(JSON.parse(res.data));
          if (JSON.parse(res.data).ack == 1) {
            wx.navigateBack()
          }
        })
      }
      
    }
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
      }
    });
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