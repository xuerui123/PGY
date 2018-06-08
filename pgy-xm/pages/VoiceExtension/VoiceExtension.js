// pages/ZZGJ/ZZGJ.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuShow: true,
    wordShow: true,
    sensitiveShow: true,
    hideNum: false,
    roomList: [],
    roomObj: {},
    status: 'VC_PLAY',
    btnName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getStorage({
      key: 'equipmentObj',
      success: function (res) {
        let roomObj = { name: res.data.dloca }
        that.setData({
          yid: res.data.yid,
          roomObj: roomObj,
          equipmentObj: res.data,
        })
      },
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
          uid: res.data,
        })
      }
    });
    wx.getStorage({
      key: 'did',
      success: function (res) {
        that.setData({
          did: res.data,
        })        
      }
    });
    wx.getStorage({
      key: 'roomList',
      success: function (res) {        
        that.setData({
          roomList: res.data,
        })
      }
    });
  },
  action: function (e) {
    let that = this;
    console.log(e.currentTarget.dataset.str)
    let str = e.currentTarget.dataset.str, dvcm = e.currentTarget.dataset.dvcm;
    this.setData({
      btnName: str
    })
    setTimeout(function () {
      that.setData({
        btnName: ''
      })
    }, 300)
    if (str == 'VC_PLAY') {
      this.setData({
        btnName: str,
      })
      setTimeout(function () {
        that.setData({
          btnName: '',
          status: 'VC_PAUSE'
        })
      }, 300)
    } else if (str == 'VC_PAUSE') {
      this.setData({
        btnName: str,
      })
      setTimeout(function () {
        that.setData({
          btnName: '',
          status: 'VC_PLAY'
        })
      }, 300)
    }
    wx.sendSocketMessage(
      {
        data: JSON.stringify({
          "op": "device",
          "act": "action",
          "uid": that.data.uid,
          "did": that.data.did,
          "date": {
            "fm": "uip",
            "dvcm": dvcm,
            "dkey": str,
            "yid": that.data.yid,
          }
        })
      })
    wx.onSocketMessage(function (res) {
      console.log(res)
    })
  },
  showMenu: function () {
    this.setData({
      menuShow: !this.data.menuShow
    })
  },
  changeWord: function () {
    this.setData({
      menuShow: !this.data.menuShow,
      wordShow: !this.data.wordShow
    })
  },
  changeSensitive: function () {
    this.setData({
      menuShow: !this.data.menuShow,
      sensitiveShow: !this.data.sensitiveShow
    })
  },
  wordConfirm: function (e) {
    //管家名提交
    this.changeWord()
  },
  wordCancel: function () {
    //管家名取消
    this.changeWord()
  },
  sensitiveConfirm: function (e) {
    //灵敏度提交
    this.changeSensitive()
  },
  sensitiveCancel: function () {
    //灵敏度取消
    this.changeSensitive()
  },
  hostName: function (e) {
    //修改管家唤醒词
    console.log(e.detail.value)
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
            wx.navigateBack({})
            wx.showToast({
              title: '删除成功',
            })

          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  sensitivChange: function (e) {
    console.log(e)
  },
  room: function (e) {
    console.log(e.detail.value[0])
    this.setData({
      roomObj: this.data.roomList[e.detail.value[0]]
    })
    console.log(this.data)
  },
  confirm: function () {
    let roomObj = this.data.roomObj, name, that = this;
    if (roomObj.name == '默认房间') {
      name = "default"
    } else {
      name = roomObj.name
    }
    wx.sendSocketMessage({
      data: JSON.stringify({
        "op": "device",
        "act": "update",
        "uid": that.data.uid,
        "did": that.data.did,
        "date": {
          "yid": that.data.yid,
          "dloca": name
        }
      })
    })
    wx.onSocketMessage(function (res) {
      console.log(res)
      if (JSON.parse(res.data).ack == 1) {
        that.setData({
          hideNum: 0,
          roomName: that.data.roomObj.name
        })
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