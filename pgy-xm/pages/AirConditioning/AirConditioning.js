// pages/controller1/controller1.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    KTstatus: 'http://192.168.1.215:3400/img/snow.svg',
    menuShow: true,
    hideNum: '',
    roomList: [],roomList: [],
    roomName: '',
    roomObj: {},
    uid: '',
    did: '',
    yid: '',
    btnName: '',
    setPage: 2,
    onoff: 0,
    Pattern: '2',
    speed: '1',
    temperature: '25',
    KTpanel: 1,
    SBtype: '',
    brand: '',
    studyList: { 'F_ONOFF': 0, 'F_HEAD': 0, 'F_WINDMODE': 0, 'F_TIMER': 0, 'F_ONSPEED': 0 }
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
          that.setData({ yid: res.data.yid, roomObj: roomObj, roomName: roomObj.name, equipmentObj: res.data })
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
    wx.getStorage({
      key: 'roomList',
      success: function (res) {
        that.setData({
          roomList: res.data,
        })
      }
    });
    if (this.data.SBtype == 'choose') {
      this.loadList();
    }
    if (this.data.SBtype != 'choose') {
      wx.getStorage({
        key: 'AirConditioning',
        success: function (res) {
          that.setData({
            onoff: res.data.onoff,
            Pattern: res.data.Pattern,
            speed: res.data.speed,
            temperature: res.data.temperature
          })
          if (that.data.SBtype == 'choose') {
            that.setData({
              onoff: 0
            })
          }
        }
      });
    }
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
        btnName: 'ON'
      })

    })
  },
  choseKTstatus: function (e) {
    let that = this;
    let onoff = this.data.onoff, pattern = e.currentTarget.dataset.pattern, speed = this.data.speed,
      temperature = this.data.temperature;
    if (this.data.SBtype == 'choose') {
      let dkey = 1 + "" + pattern + "" + temperature + '' + speed + "11";
      if (pattern == 2) {
        wx.sendSocketMessage({
          data: JSON.stringify({
            "op": "device",
            "act": "action",
            "uid": that.data.uid,
            "did": that.data.did,
            "date": {
              "fm": "uip",
              "dkey": dkey,
              "dvcm": '',
              "yid": that.data.yid,
            }
          })
        })
        wx.onSocketMessage(function (res) {
          console.log(res)
          wx.showModal({
            title: '空调',
            content: '是否正确响应',
            success: function (res) {
              if (res.confirm) {
                that.setData({
                  btnName: 'hot'
                })

              } else {
                if ((parseInt(that.data.KTpanel) + 1) > that.data.list.length) {
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
                    KTpanel: parseInt(that.data.KTpanel) + 1,
                    btnName: 'ON'
                  })
                }
              }
            }
          })
        })
      } else if (pattern == 5) {
        wx.sendSocketMessage({
          data: JSON.stringify({
            "op": "device",
            "act": "action",
            "uid": that.data.uid,
            "did": that.data.did,
            "date": {
              "fm": "uip",
              "dkey": dkey,
              "dvcm": '',
              "yid": that.data.yid,
            }
          })
        })
        wx.onSocketMessage(function (res) {
          console.log(res)
          wx.showModal({
            title: '空调',
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
                      'remoid': that.data.list[JSON.parse(that.data.KTpanel) - 1],
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
                if ((parseInt(that.data.KTpanel) + 1) > that.data.list.length) {
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
                    KTpanel: parseInt(that.data.KTpanel) + 1,
                    btnName: 'ON'
                  })
                }
              }
            }
          })
        })
      }
    } else {
      if (onoff == 1) {
        this.setData({
          KTstatus: e.currentTarget.dataset.str,
        })
        if (pattern == 2) {
          this.setData({
            btnName: "cool"
          })
          setTimeout(function () {
            that.setData({
              btnName: ""
            })
          }, 300)
        } else if (pattern == 5) {
          this.setData({
            btnName: "hot"
          })
          setTimeout(function () {
            that.setData({
              btnName: ""
            })
          }, 300)
        }
        let dkey = onoff + "" + pattern + "" + temperature + '' + speed + "11"
        wx.sendSocketMessage({
          data: JSON.stringify({
            "op": "device",
            "act": "action",
            "uid": that.data.uid,
            "did": that.data.did,
            "date": {
              "fm": "uip",
              "dkey": dkey,
              dvcm: '',
              "yid": that.data.yid,
            }
          })
        })
        wx.onSocketMessage(function (res) {
          console.log(res)
        })
        console.log(onoff + "" + pattern + "" + temperature + '' + speed + "11")
      } else {
        wx.showModal({
          title: '提示',
          content: '请先开启空调',
        })
      }
    }

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
  onKT: function (e) {
    let that = this;
    let onoff = e.currentTarget.dataset.onoff, Pattern = this.data.Pattern, speed = this.data.speed,
      temperature = this.data.temperature;
    let dkey = onoff + "" + Pattern + "" + temperature + '' + speed + "11"
    if (this.data.SBtype == 'choose') {
      wx.sendSocketMessage({
        data: JSON.stringify({
          "op": "device",
          "act": "action",
          "uid": that.data.uid,
          "did": that.data.did,
          "date": {
            "fm": "uip",
            dvcm: '',
            "dkey": dkey,
            'remoid': that.data.list[JSON.parse(that.data.KTpanel) - 1],
            "yid": that.data.yid,
          }
        })
      })
      wx.onSocketMessage(function (res) {
        console.log(res)
        wx.showModal({
          title: '空调',
          content: '是否正确响应',
          success: function (res) {
            if (res.confirm) {
              that.setData({
                btnName: 'cool'
              })
            } else {
              if ((parseInt(that.data.KTpanel) + 1) > that.data.list.length) {
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
                  KTpanel: parseInt(that.data.KTpanel) + 1,
                  btnName: 'ON'
                })
              }

            }
          }
        })
      })
    } else {
      this.setData({
        btnName: "ON"
      })
      setTimeout(function () {
        that.setData({
          btnName: "",
          onoff: 1
        })
        wx.sendSocketMessage({
          data: JSON.stringify({
            "op": "device",
            "act": "action",
            "uid": that.data.uid,
            "did": that.data.did,
            "date": {
              "fm": "uip",
              "dkey": dkey,
              dvcm: '',
              "yid": that.data.yid,
            }
          })
        })
        wx.onSocketMessage(function (res) {
          console.log(res)
        })
      }, 300)
    }
    console.log(onoff + "" + Pattern + "" + temperature + '' + speed + "11")
  },
  offKT: function (e) {
    let that = this;
    let onoff = e.currentTarget.dataset.onoff, Pattern = this.data.Pattern, speed = this.data.speed,
      temperature = this.data.temperature;
    this.setData({
      btnName: "OFF"
    })
    setTimeout(function () {
      that.setData({
        btnName: "",
        onoff: 0
      })
    }, 300)
    console.log('0530413')
    let dkey = '0530413'
    wx.sendSocketMessage({
      data: JSON.stringify({
        "op": "device",
        "act": "action",
        "uid": that.data.uid,
        "did": that.data.did,
        "date": {
          "fm": "uip",
          "dkey": dkey,
          dvcm: '',
          "yid": that.data.yid,
        }
      })
    })
    wx.onSocketMessage(function (res) {
      console.log(res)
    })
  },
  speed: function () {
    let that = this;
    let onoff = this.data.onoff, Pattern = this.data.Pattern, speed = this.data.speed,
      temperature = this.data.temperature;
    if (onoff == 1) {
      this.setData({
        btnName: "speed"
      })
      console.log(speed)
      if (speed < 4) {
        speed = parseInt(speed) + 1
      } else if (speed == 4) {
        speed = 1
      }
      setTimeout(function () {
        that.setData({
          btnName: "",
          speed: speed
        })
      }, 300)
      let dkey = onoff + "" + Pattern + "" + temperature + '' + speed + "11"
      wx.sendSocketMessage({
        data: JSON.stringify({
          "op": "device",
          "act": "action",
          "uid": that.data.uid,
          "did": that.data.did,
          "date": {
            "fm": "uip",
            "dkey": dkey,
            dvcm: '',
            "yid": that.data.yid,
          }
        })
      })
      wx.onSocketMessage(function (res) {
        console.log(res)
      })
      console.log(onoff + "" + Pattern + "" + temperature + '' + speed + "11")
    } else {
      wx.showModal({
        title: '提示',
        content: '请先开启空调',
      })
    }
  },
  jia: function () {
    let that = this;
    let onoff = this.data.onoff, Pattern = this.data.Pattern, speed = this.data.speed,
      temperature = this.data.temperature;
    if (onoff == 1) {
      if (temperature < 30) {
        temperature = parseInt(temperature) + 1
      } else if (temperature = 30) {
        temperature = 30
      }
      this.setData({
        btnName: "jia",
        temperature: temperature
      })
      setTimeout(function () {
        that.setData({
          btnName: ""
        })
      }, 300)
      let dkey = onoff + "" + Pattern + "" + temperature + '' + speed + "11"
      wx.sendSocketMessage({
        data: JSON.stringify({
          "op": "device",
          "act": "action",
          "uid": that.data.uid,
          "did": that.data.did,
          "date": {
            "fm": "uip",
            "dkey": dkey,
            dvcm: '',
            "yid": that.data.yid,
          }
        })
      })
      wx.onSocketMessage(function (res) {
        console.log(res)
      })
      console.log(onoff + "" + Pattern + "" + temperature + '' + speed + "11")
    } else {
      wx.showModal({
        title: '提示',
        content: '请先开启空调',
      })
    }
  },
  jian: function () {
    let that = this;
    let onoff = this.data.onoff, Pattern = this.data.Pattern, speed = this.data.speed,
      temperature = this.data.temperature;
    if (onoff == 1) {
      if (temperature > 19) {
        temperature = parseInt(temperature) - 1
      } else if (temperature = 19) {
        temperature = 19
      }
      this.setData({
        btnName: "jian",
        temperature: temperature
      })
      setTimeout(function () {
        that.setData({
          btnName: ""
        })
      }, 300)
      let dkey = onoff + "" + Pattern + "" + temperature + '' + speed + "11"
      wx.sendSocketMessage({
        data: JSON.stringify({
          "op": "device",
          "act": "action",
          "uid": that.data.uid,
          "did": that.data.did,
          "date": {
            "fm": "uip",
            dvcm: '',
            "dkey": dkey,
            "yid": that.data.yid,
          }
        })
      })
      wx.onSocketMessage(function (res) {
        console.log(res)
      })
      console.log(onoff + "" + Pattern + "" + temperature + '' + speed + "11")
    } else {
      wx.showModal({
        title: '提示',
        content: '请先开启空调',
      })
    }
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
  changType: function () {
    this.showMenu();
    this.setData({
      SBtype: 'study'
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
    let AirConditioning = {
      onoff: this.data.onoff,
      Pattern: this.data.Pattern,
      speed: this.data.speed,
      temperature: this.data.temperature
    }
    wx.setStorage({
      key: 'AirConditioning',
      data: AirConditioning,
    })
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