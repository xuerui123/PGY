// pages/JHQ/JHQ.js
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
    SBtype: '',
    SBpanel: '1',
    JHQtype: 'A_CLOSE',
    AK1:'',
    studyList: { A_POWER: 0, A_CLOSE: 0, A_AUTO: 0, A_SPEED: 0, A_MODE: 0, A_TIMER:0,A_AK1:0}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
            AK1:res.data.dnlp
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
        btnName: 'A_POWER'
      })

    })
  },
  JHQON: function () {
    let that = this;
    if (this.data.SBtype == 'choose') {
      wx.sendSocketMessage({
        data: JSON.stringify({
          "op": "device",
          "act": "action",
          "uid": that.data.uid,
          "did": that.data.did,
          "date": {
            "fm": "uip",
            'remoid': that.data.list[JSON.parse(that.data.SBpanel) - 1],
            "dvcm": '',
            "dkey": 'A_POWER',
            "yid": that.data.yid,
          }
        })
      })
      wx.onSocketMessage(function (res) {
        console.log(res)
      })
      wx.showModal({
        title: '空气净化器',
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
                btnName: 'A_POWER'
              })
            }
            
          }
        }
      })
    } else if (this.data.SBtype == 'study') {
      
      let studyList = that.data.studyList;
      studyList.A_POWER = 1;
      wx.sendSocketMessage({
        data: JSON.stringify({
          "op": "device",
          "act": "study",
          "uid": that.data.uid,
          "did": that.data.did,
          "date": {
            "pt": 1,
            "isgru": 0,
            "dpanel": 'AirPurifier',
            "dch": that.data.equipmentObj.dch,
            "dkey": 'A_POWER',
            "dvcm":"",
            "yid": that.data.yid,
          }
        })
      })
      wx.onSocketMessage(function (res) {
        console.log(res)
        that.setData({
          studyList: studyList,
          JHQtype: 'A_POWER'
        })
      })
    } else {
      this.setData({
        btnName: 'A_POWER'
      })
      setTimeout(function () {
        that.setData({
          btnName: 'A_POWER',
          JHQtype: 'A_POWER'
        })
        wx.sendSocketMessage({
          data: JSON.stringify({
            "op": "device",
            "act": "action",
            "uid": that.data.uid,
            "did": that.data.did,
            "date": {
              "fm": "uip",
              "dkey": 'A_POWER',
              "yid": that.data.yid,
            }
          })
        })
        wx.onSocketMessage(function (res) {
          console.log(res)
        })
      }, 300)

    }
  },
  JHQOFF: function () {
    let that = this;
    if (this.data.SBtype == 'study') {
      let studyList = that.data.studyList;
      studyList.A_CLOSE = 1;
      wx.sendSocketMessage({
        data: JSON.stringify({
          "op": "device",
          "act": "study",
          "uid": that.data.uid,
          "did": that.data.did,
          "date": {
            "pt": 1,
            "isgru": 0,
            "dpanel": 'AirPurifier',
            "dch": that.data.equipmentObj.dch,
            "dkey": 'A_CLOSE',
            "dvcm": "",
            "yid": that.data.yid,
          }
        })
      })
      wx.onSocketMessage(function (res) {
        console.log(res)
        that.setData({
          studyList: studyList,
          JHQtype: 'A_CLOSE'
        })
      })
    } else {
      this.setData({
        btnName: 'A_CLOSE'
      })
      setTimeout(function () {
        that.setData({
          btnName: '',
          JHQtype: 'A_CLOSE'
        })
        wx.sendSocketMessage({
          data: JSON.stringify({
            "op": "device",
            "act": "action",
            "uid": that.data.uid,
            "did": that.data.did,
            "date": {
              "fm": "uip",
              "dkey": 'A_CLOSE',
              "dvcm": '',
              "yid": that.data.yid,
            }
          })
        })
        wx.onSocketMessage(function (res) {
          console.log(res)
        })
      }, 300)

    }
  },
  action: function (e) {
    let that = this;
    if (this.data.SBtype == 'study') {
      let studyList = that.data.studyList;
      let key = e.currentTarget.dataset.key;
      for (let item in studyList) {
        if (item == key) {
          studyList[item] = 1
        }
      }
      if(key=='A_AK1'){
        studyList.A_AK1 = 1;
        that.setData({
          studyList: studyList
        })
        wx.navigateTo({
          url: '../ZDY2/ZDY2?btn=AK1&pt=1&isgru=0'
        });
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
              "dpanel": 'AirPurifier',
              "dch": that.data.equipmentObj.dch,
              "dvcm": '',
              "dkey": e.currentTarget.dataset.key,
              "yid": that.data.yid,
            }
          })
        })
        wx.onSocketMessage(function (res) {
          console.log(res)
          that.setData({
            studyList: studyList
          })
        })
      }
      
    } else {
      this.setData({
        btnName: e.currentTarget.dataset.key
      })
      setTimeout(function () {
        that.setData({
          btnName: '',
        })
      }, 300)
      if (e.currentTarget.dataset.key == 'A_AK1') {
        wx.sendSocketMessage({
          data: JSON.stringify({
            "op": "device",
            "act": "action",
            "uid": that.data.uid,
            "did": that.data.did,
            "date": {
              "fm": "uip",
              "dkey": '',
              "dvcm": that.data.AK1,
              "yid": that.data.yid,
            }
          })
        })
        wx.onSocketMessage(function (res) {
          console.log(res)
        })
      }else{
        wx.sendSocketMessage({
          data: JSON.stringify({
            "op": "device",
            "act": "action",
            "uid": that.data.uid,
            "did": that.data.did,
            "date": {
              "fm": "uip",
              "dkey": e.currentTarget.dataset.key,
              "dvcm": '',
              "yid": that.data.yid,
            }
          })
        })
        wx.onSocketMessage(function (res) {
          console.log(res)
        })  
      }      
    }
  },
  changType: function () {
    this.showMenu();
    this.setData({
      SBtype: 'study'
    })
  },
  Qstudy:function(){
    this.setData({
      SBtype: ''
    })
  },
  /*** 
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