// pages/JDH/JDH.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuShow: true,
    hideNum: false,
    roomList: [],roomList: [],
    setPage: 2,
    equipmentObj: {},
    uid: '',
    did: '',
    yid: '',
    boxNum: '',
    boxKey: '',
    name: '',
    brand: '',
    SBtype: '',
    TVpanel: '1',
    btnName: '',
    studyList: { "J_ONOFF": 0, "J_MENU": 0, "J_GUIDE": 0, "J_BACK": 0, "J_AK1": 0, "J_Pup": 0, "J_Pdown": 0, "J_Vup": 0, "J_Vdown": 0, "J_UP": 0, "J_DOWN": 0, "J_LEFT": 0, "J_RIGHT": 0, "J_OK": 0 },
    list: []
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
          that.setData({
            yid: res.data.yid,roomName: roomObj.name,
            equipmentObj: res.data
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
  showNumList: function () {
    this.setData({
      hideNum: 2,
    })
  },
  hidePage: function () {
    this.setData({
      hideNum: 0,
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
      console.log(JSON.parse(res.data));
      that.setData({
        list: JSON.parse(res.data).msg.devcode,
        btnName: 'J_ONOFF'
      })

    })
  },
  action: function (e) {
    let that = this;
    let panel = this.data.TVpanel
    console.log(e)
    if (this.data.SBtype == 'choose') {
      if (e.currentTarget.dataset.key == 'J_ONOFF') {
        wx.sendSocketMessage({
          data: JSON.stringify({
            "op": "device",
            "act": "action",
            "uid": that.data.uid,
            "did": that.data.did,
            "date": {
              "fm": "uip",
              'remoid': that.data.list[JSON.parse(that.data.TVpanel) - 1],
              "dkey": 'J_ONOFF',
              "yid": that.data.yid,
            }
          })
        })
        wx.onSocketMessage(function (res) {
          console.log(res)
        })
        wx.showModal({
          title: '电视',
          content: '是否正确响应',
          success: function (res) {
            if (res.confirm) {
              that.setData({
                btnName: 'J_V+'
              })

            } else {
              if ((parseInt(panel) + 1) > that.data.list.length) {
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
                  TVpanel: parseInt(panel) + 1,
                  btnName: 'J_ONOFF'
                })
              }              
            }
          }
        })
      } else if (e.currentTarget.dataset.key == 'J_V+') {
        wx.sendSocketMessage({
          data: JSON.stringify({
            "op": "device",
            "act": "action",
            "uid": that.data.uid,
            "did": that.data.did,
            "date": {
              "fm": "uip",
              'remoid': that.data.list[JSON.parse(that.data.TVpanel) - 1],
              "dkey": 'J_V+',
              "yid": that.data.yid,
            }
          })
        })
        wx.onSocketMessage(function (res) {
          console.log(res)
        })
        wx.showModal({
          title: '电视',
          content: '是否正确响应',
          success: function (res) {
            if (res.confirm) {
              that.setData({
                btnName: 'J_V-'
              })
            } else {
              if ((parseInt(panel) + 1) > that.data.list.length) {
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
                  TVpanel: parseInt(panel) + 1,
                  btnName: 'J_ONOFF'
                })
              }
              
            }
          }
        })
      } else if (e.currentTarget.dataset.key == 'J_V-') {
        wx.sendSocketMessage({
          data: JSON.stringify({
            "op": "device",
            "act": "action",
            "uid": that.data.uid,
            "did": that.data.did,
            "date": {
              "fm": "uip",
              'remoid': that.data.list[JSON.parse(that.data.TVpanel) - 1],
              "dkey": 'J_V-',
              "yid": that.data.yid,
            }
          })
        })
        wx.onSocketMessage(function (res) {
          console.log(res)
        })
        wx.showModal({
          title: '电视',
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
                    'remoid': that.data.list[JSON.parse(that.data.TVpanel) - 1],
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
              if ((parseInt(panel) + 1) > that.data.list.length) {
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
                  TVpanel: parseInt(panel) + 1,
                  btnName: 'J_ONOFF'
                })
              }              
            }
          }
        })
      }

    } else if (this.data.SBtype == 'study') {
      let studyList = that.data.studyList;
      let key = e.currentTarget.dataset.key;
      if (key == 'J_P+') {
        key = 'J_Pup'
        for (let item in studyList) {
          if (item == key) {
            studyList[item] = 1
          }
        }
      } else if (key == 'J_P-') {
        key = 'J_Pdown'
        for (let item in studyList) {
          if (item == key) {
            studyList[item] = 1
          }
        }
      }
      else if (key == 'J_V+') {
        key = 'J_Vup'
        for (let item in studyList) {
          if (item == key) {
            studyList[item] = 1
          }
        }
      } else if (key == 'J_V-') {
        key = 'J_Vdown'
        for (let item in studyList) {
          if (item == key) {
            studyList[item] = 1
          }
        }
      }
      console.log(key)
      for (let item in studyList) {
        if (item == key) {
          studyList[item] = 1
        }
      }

      if (key == 'J_AK1') {

        wx.navigateTo({
          url: '../ZDY2/ZDY2'
        });
      } else {
        wx.sendSocketMessage({
          data: JSON.stringify({
            "op": "device",
            "act": "study",
            "uid": that.data.uid,
            "did": that.data.did,
            "date": {
              "pt": 1,
              "isgru": 0,
              "dpanel": 'TV',
              "dch": '01',
              "fm": "uip",
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
      console.log(studyList)
    } else {
      this.setData({
        btnName: e.currentTarget.dataset.key
      })
      setTimeout(function () {
        that.setData({
          btnName: "",
        })
        wx.sendSocketMessage({
          data: JSON.stringify({
            "op": "device",
            "act": "action",
            "uid": that.data.uid,
            "did": that.data.did,
            "date": {
              "fm": "uip",
              "dkey": e.currentTarget.dataset.key,
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
  chooseNum: function (e) {
    console.log(e.currentTarget)
    let num = e.currentTarget.dataset.num;
    let key = e.currentTarget.dataset.key;
    let boxNum = this.data.boxNum;
    let boxKey = this.data.boxKey;
    this.setData({
      boxNum: boxNum + num,
      boxKey: boxKey + ',' + key
    })
  },
  studyBtn: function () {
    this.showMenu();
    this.setData({
      SBtype: 'study',
    })
  },
  actionNum: function () {
    let that = this;
    let key = this.data.boxKey;
    this.setData({
      boxNum: '',
    })
    console.log(key)
    wx.sendSocketMessage({
      data: JSON.stringify({
        "op": "device",
        "act": "action",
        "uid": that.data.uid,
        "did": that.data.did,
        "date": {
          "fm": "uip",
          "dkey": key,
          "yid": that.data.yid,
        }
      })
    })
    wx.onSocketMessage(function (res) {
      console.log(res)
      that.setData({
        boxKey: '',
      })
    })
  },
  confirm: function () {
    this.showRoomList();
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