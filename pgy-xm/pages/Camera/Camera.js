// pages/DF/DF.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    menuShow: true,
    hideNum: false,
    roomList: [],roomList: [],
    uid: '',
    did: '',
    yid: '',
    name: '',
    brand: '',
    equipmentObj: '',
    btnName: '',
    SBtype: '',
    SBpanel: 1,
    AK1: '',    
    studyBtn:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this;
    if (!options.name) {
      wx.getStorage({
        key: 'equipmentObj',
        success: function (res) {
          let roomObj = { name: res.data.dloca }
          that.setData({
            yid: res.data.yid,
            roomObj: roomObj,roomName: roomObj.name,
            equipmentObj: res.data,
            AK1: res.data.dnlp
          })
        },
      })
    } else {
      this.setData({
        name: options.name,
        brand: options.brand,
        SBtype: options.SBtype,
        yid: options.yid,
      })

    }

    console.log(this.data)
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
      }
    })
    wx.getStorage({
      key: 'did',
      success: function (res) {
        that.setData({
          did: res.data
        })
        if (that.data.SBtype == 'choose') {
          that.loadList()
        }
      }
    })
    wx.getStorage({
      key: 'roomList',
      success: function (res) {
        that.setData({
          roomList: res.data
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
      roomObj: this.data.roomList[0]
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
  loadList: function () {
    let that = this;
    wx.sendSocketMessage(
      {
        data: JSON.stringify({
          "op": "irdatebase",
          "act": "getdevcode",
          "uid": that.data.uid,
          "did": that.data.did,
          "date": {
            "brand": that.data.brand,
            "devtype": that.data.name
          }
        })
      })
    wx.onSocketMessage(function (res) {
      that.setData({
        list: JSON.parse(res.data).msg.devcode,
        btnName: 'P_PHOTO'
      })

    })
  },

  action: function (e) {
    let that = this;
    let key = e.currentTarget.dataset.key;
    if (this.data.SBtype == 'choose') {      
        wx.sendSocketMessage({
          data: JSON.stringify({
            "op": "device",
            "act": "action",
            "uid": that.data.uid,
            "did": that.data.did,
            "date": {
              "fm": "uip",
              "dkey": 'P_OHOTO',
              "dvcm": "",
              'remoid': that.data.list[JSON.parse(that.data.SBpanel) - 1],
              "yid": that.data.yid,
            }
          })
        })
        wx.onSocketMessage(function (res) {
          console.log(res)
          wx.showModal({
            title: '单反',
            content: '是否正确响应',
            success: function (res) {
              if (res.confirm) {
                wx.sendSocketMessage({
                  data: JSON.stringify({
                    "op": "device",
                    "act": "update",
                    "uid": that.data.uid,
                    "did": that.data.did,
                    "date": {
                      "fm": "uip",
                      'remoid': that.data.list[JSON.parse(that.data.SBpanel) - 1],
                      "yid": that.data.yid,
                    }
                  })
                })
                wx.onSocketMessage(function (res) {
                  console.log(JSON.parse(res.data))
                  wx.navigateBack({
                    delta: 3
                  })
                })
              } else {
                if ((parseInt(that.data.SBpanel) + 1) > that.data.list.length) {
                  wx.showModal({
                    title: '提示',
                    content: '没有找到匹配面板,请使用用户上传或者自定义该设备',
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
                          console.log(res)
                          wx.navigateBack({
                            delta: 3
                          })
                        })
                      }
                    }
                  })
                } else {
                  that.setData({
                    SBpanel: parseInt(that.data.SBpanel) + 1,
                    btnName: 'P_OHOTO'
                  })
                }
                
              }
            }
          })
        })
      
      
    } else if (this.data.SBtype == 'study') {      
      let key = e.currentTarget.dataset.key;            
        wx.sendSocketMessage({
          data: JSON.stringify({
            "op": "device",
            "act": "study",
            "uid": that.data.uid,
            "did": that.data.did,
            "date": {
              "pt": 1,
              "isgru": 0,
              "dpanel": 'Camera',
              "dch": that.data.equipmentObj.dch,
              "dkey": 'P_OHOTO',
              "yid": that.data.yid,
            }
          })
        })
        wx.onSocketMessage(function (res) {
          console.log(res)
          that.setData({
            studyBtn: 'P_PHOTO'
          })
        })    
    } else {
      this.setData({
        btnName: e.currentTarget.dataset.key
      })
      setTimeout(function () {
        that.setData({
          btnName: '',
        })
        wx.sendSocketMessage({
          data: JSON.stringify({
            "op": "device",
            "act": "action",
            "uid": that.data.uid,
            "did": that.data.did,
            "date": {
              "fm": "uip",
              "dkey": 'P_OHOTO',
              "dvcm": '',
              "yid": that.data.yid,
            }
          })
        })
        wx.onSocketMessage(function (res) {
          console.log(JSON.parse(res.data))
        })
      }, 300)      
    }
  },
  changType: function () {
    this.showMenu();
    this.setData({
      SBtype: 'study'
    })
  },
  Qstudy: function () {
    this.setData({
      SBtype: ''
    })
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
  room: function (e) {
    console.log(e.detail.value[0])
    this.setData({
      roomObj: this.data.roomList[e.detail.value[0]],      roomName:this.data.roomList[e.detail.value[0]].name
    })
    console.log(this.data)
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