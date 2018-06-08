// pages/clock/clock.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: '',
    did:'',
    clockList: [
      { str: "每天早上7点提醒我起床" },
      { str: "下午3点提醒我开会" },
      { str: "每天晚上7点提醒小宝写作业" },
      { str: "半小时后关闭电视" }
    ]
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
    let that = this    
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
        that.loadclock()
      }      
    })  
    
  },
  onHide: function () {
    
  },
  loadclock: function () {
    let that = this;
    wx.sendSocketMessage({
      data: JSON.stringify({
        "op":"clock",
        "act":"list",
        "uid": that.data.uid,
        "did": that.data.did
      })
    })
    wx.onSocketMessage(function (res) {
      console.log(JSON.parse(res.data));
      that.setData({
        clockList: JSON.parse(res.data).msg
      })            
    })
  },
  deleOnes: function (e) {
    let that = this;
    let obj = e.currentTarget.dataset.obj;
    wx.showModal({
      title: '提示',
      content: '删除' + obj.name,
      confirmColor: '#1FB4FB',
      success: function (res) {
        if (res.confirm) {
          wx.sendSocketMessage({
            data: JSON.stringify({
              "do": "deletealarm",
              "openid": 'oNpl_wVYukIxDCvXQsTgKYnTiasU',
              "deviceid": "30373331323031313164313830303737",
              "data": {
                "id": obj.id
              }
            })
          })
          wx.onSocketMessage(function (res) {
            console.log(JSON.parse(res.data));
            if (JSON.parse(res.data).return_code != 200) {
              wx.showModal({
                title: '提示',
                content: JSON.parse(res.data).return_msg,
                confirmColor: '#1FB4FB',
                success: function (res) { }
              })
            } else {
              if (JSON.parse(res.data).return_data.success == false) {
                wx.showModal({
                  title: '提示',
                  content: JSON.parse(res.data).return_data.data.text,
                  confirmColor: '#1FB4FB',
                  success: function (res) { }
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: '删除成功',
                  confirmColor: '#1FB4FB',
                  success: function (res) { }
                })
              }

            }            
            that.loadclock()
          })
        }
      }
    })
  },
  deleAll: function () {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '删除所有闹钟',
      confirmColor: '#1FB4FB',
      success: function (res) {
        if (res.confirm) {
          that.setData({
            clockList: []
          })
        }
      }
    })
  }
})