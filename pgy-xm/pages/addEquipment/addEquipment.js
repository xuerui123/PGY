// pages/addEquipment/addEquipment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hideNameBox: true,
    name: '',
    uid:'',
    did:''
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
  },
  gopage: function (e) {
    console.log(e)
    let str = e.currentTarget.dataset.str;
    let name = e.currentTarget.dataset.name;
    let page = e.currentTarget.dataset.page;
    let dch = e.currentTarget.dataset.dch;
    let dsys = e.currentTarget.dataset.dsys;
    if (str == 'DIY') {
      this.setData({
        hideNameBox: !this.data.hideNameBox
      })

    } else if (str == 'QMKG'){
      wx.navigateTo({
        url: '../' + str + '/' + str + '?SBtype=add' 
      });
    } else {
      wx.navigateTo({
        url: '../' + str + '/' + str +'?name=' +name + '&page=' +page +'&dch='+dch+'&dsys='+dsys
      });
    }
  },
  chuanglian: function (e) {
    let that = this;
    let str = e.currentTarget.dataset.str;
    wx.showModal({
      title: '提示',
      content: '确认添加该设备',
      success: function (res) {
        if (res.confirm) {
          wx.sendSocketMessage({
            data: JSON.stringify({
              "op": "device",
              "act": "add",
              "uid": that.data.uid,
              "did": that.data.did,
              "date": {
                "dch": 12,
                "dname": "窗帘",
                "dloca": "default",
                "dlogo": 'Curtain.svg',
                "dcap": "" ,
                "dsys":"1122",
                "dpanel":"Curtain"                
              }
            })
          })
          wx.onSocketMessage(function (res) {
            console.log(JSON.parse(res.data));
            if(JSON.parse(res.data).ack==0){
              wx.showModal({
                title: '提示',
                content: '添加设备失败'+JSON.parse(res.data).msg.message,
              })
            } else if (JSON.parse(res.data).ack == 1){              
              wx.navigateBack({})
              wx.showToast({
                title: '添加成功',
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  jiashiqi: function (e) {
    let that = this;
    let str = e.currentTarget.dataset.str;
    wx.showModal({
      title: '提示',
      content: '确认添加该设备',
      success: function (res) {
        if (res.confirm) {
          wx.sendSocketMessage({
            data: JSON.stringify({
              "op": "device",
              "act": "add",
              "uid": that.data.uid,
              "did": that.data.did,
              "date": {                
                "dname": "加湿器",
                "dch": "01",
                "dloca": "default",
                "dlogo": 'Humidifier.svg',
                "dcap": "",
                "dsys": "2126",
                "dpanel": "Humidifier"
              }
            })
          })
          wx.onSocketMessage(function (res) {
            console.log(JSON.parse(res.data));
            if (JSON.parse(res.data).ack == 0) {
              wx.showModal({
                title: '提示',
                content: '添加设备失败' + JSON.parse(res.data).msg.message,
              })
            } else if (JSON.parse(res.data).ack == 1) {
              wx.navigateBack({})
              wx.showToast({
                title: '添加成功',
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  saodijiqiren: function (e) {
    let that = this;
    let str = e.currentTarget.dataset.str;
    wx.showModal({
      title: '提示',
      content: '确认添加该设备',
      success: function (res) {
        if (res.confirm) {
          wx.sendSocketMessage({
            data: JSON.stringify({
              "op": "device",
              "act": "add",
              "uid": that.data.uid,
              "did": that.data.did,
              "date": {                
                "dname": "扫地机器人",
                "dch": "01",
                "dloca": "default",
                "dlogo": 'SweepingRobot.svg',
                "dcap": "",
                "dsys": "2116",
                "dpanel": "SweepingRobot"
              }
            })
          })
          wx.onSocketMessage(function (res) {
            console.log(JSON.parse(res.data));
            if (JSON.parse(res.data).ack == 0) {
              wx.showModal({
                title: '提示',
                content: '添加设备失败' + JSON.parse(res.data).msg.message,
              })
            } else if (JSON.parse(res.data).ack == 1) {
              wx.navigateBack({})
              wx.showToast({
                title: '添加成功',
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  gongfang: function (e) {
    let that = this;
    let str = e.currentTarget.dataset.str;
    wx.showModal({
      title: '提示',
      content: '确认添加该设备',
      success: function (res) {
        if (res.confirm) {
          wx.sendSocketMessage({
            data: JSON.stringify({
              "op": "device",
              "act": "add",
              "uid": that.data.uid,
              "did": that.data.did,
              "date": {                
                "dname": "功放",
                "dch":"01",
                "dloca": "default",
                "dlogo": 'PowerAmplifier.svg',
                "dcap": "",
                "dsys": "2126",
                "dpanel": "PowerAmplifier"
              }
            })
          })
          wx.onSocketMessage(function (res) {
            console.log(JSON.parse(res.data));
            if (JSON.parse(res.data).ack == 0) {
              wx.showModal({
                title: '提示',
                content: '添加设备失败' + JSON.parse(res.data).msg.message,
              })
            } else if (JSON.parse(res.data).ack == 1) {
              wx.navigateBack({})
              wx.showToast({
                title: '添加成功',
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  addname: function (e) {
    this.setData({
      name: e.detail.value
    });
  },
  //取消按钮  
  cancel: function () {
    this.setData({
      hideNameBox: true
    });
  },
  //确认 
  confirm: function (e) {
    let that = this;
    if (!this.data.name) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '设备名不可为空'
      })
    } else {
      wx.sendSocketMessage(
        {
          data: JSON.stringify({
            "op": "device",
            "act": "add",
            "uid": that.data.uid,
            "did": that.data.did,
            "date":{
              dloca:'default',
              dpanel:'DIY',
              dlogo: 'DIY.svg',
              dname:that.data.name
            }
          })
        })
      wx.onSocketMessage(function (res) {
        console.log(JSON.parse(res.data));
        wx.navigateBack({})
      })      
    }
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