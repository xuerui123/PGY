// pages/DF/DF.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    menuShow: true,
    hideNum: false,    
    lampName:'',
    uid:'',
    did:'',
    yid:'',
    equipmentObj:{},
    btnName:''
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
    let that =this;
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          uid: res.data
        })
      }
    })
    wx.getStorage({
      key: 'did',
      success: function (res) {
        that.setData({
          did: res.data
        })
      }
    })
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          uid: res.data
        })
      }
    })
    wx.getStorage({
      key: 'equipmentObj',
      success: function (res) {
        that.setData({
          yid:res.data.yid,
          equipmentObj: res.data
        })
      }
    })
  },
  showMenu: function () {
    this.setData({
      menuShow: !this.data.menuShow
    })
  },
  showRoomList: function () {
    this.setData({
      menuShow: !this.data.menuShow,
      hideNum: !this.data.hideNum,
    })
  },
  delEquipment: function () {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '删除这个设备',
      success: function (res) {
        if (res.confirm) {
          wx.sendSocketMessage({
            data: JSON.stringify({
              "op": "device",
              "act": "del",
              "uid": that.data.uid,
              "did": that.data.did,
              "date": {
                "yid": that.data.yid
              }
            })
          })
          wx.onSocketMessage(function (res) {
            console.log(JSON.parse(res.data));
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  action:function(e){
    let that = this
    this.setData({
      btnName: e.currentTarget.dataset.key
    })
    setTimeout(function () {
      that.setData({
        btnName: ''
      })
    }, 300)
    wx.sendSocketMessage({
      data: JSON.stringify({
        "op": "device",
        "act": "action",
        "uid": that.data.uid,
        "did": that.data.did,
        "date": {
          "fm": "uip",
          "dvcm": '',
          "dkey": e.currentTarget.dataset.key,
          "yid": that.data.yid,
        }
      })
    })
    wx.onSocketMessage(function (res) {
      console.log(res)
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