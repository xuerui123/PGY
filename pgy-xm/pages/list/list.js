// pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    uid: '',
    did: '',
    list: [],
    dch: '',
    dsys: '',
    searchName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      name: options.name,
      page: options.page,
      dch: options.dch,
      dsys: options.dsys
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
          uid: res.data
        })
        that.loadList();
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
  loadList: function () {
    let that = this;
    wx.sendSocketMessage(
      {
        data: JSON.stringify({
          "op": "irdatebase",
          "act": "getbrand",
          "uid": that.data.uid,
          "did": that.data.did,
          "date": {
            "devtype": that.data.name
          }
        })
      })
    wx.onSocketMessage(function (res) {
      console.log('122222', JSON.parse(res.data));
      let list = JSON.parse(res.data).msg
      for (let i = 0; i < list.length; i++) {
        list[i].show = 1
      }
      that.setData({
        list: list
      })

    })
  },
  creater: function (e) {
    let that = this;
    console.log(e.currentTarget.dataset.brand)
    let brand = e.currentTarget.dataset.brand, name = this.data.name, page = this.data.page;
    wx.showModal({
      title: '提示',
      content: '创建该设备',
      success: function (res) {
        if (res.confirm) {
          if (name == '电风扇') {
            if (brand == '格力' || brand == '华生' || brand == '联创' || brand == '小行星' || brand == '灿坤' || brand == '骆驼') {
              console.log('Fan2')
              page = 'Fan2'
              wx.sendSocketMessage({
                data: JSON.stringify({
                  "op": "device",
                  "act": "add",
                  "uid": that.data.uid,
                  "did": that.data.did,
                  "date": {
                    "dch": that.data.dch,
                    "dname": that.data.name,
                    "dloca": "default",
                    "online": "1",
                    "dlogo": 'Fan.svg',
                    "dbra": brand,
                    "dsys": that.data.dsys,
                    "dpanel": page
                  }
                })
              })
              wx.onSocketMessage(function (res) {
                console.log(JSON.parse(res.data));
                if (JSON.parse(res.data).ack == 0) {
                  wx.showModal({
                    title: '提示',
                    content: '添加设备失败' + JSON.parse(res.data).msg,
                  })
                } else if (JSON.parse(res.data).ack == 1) {
                  wx.navigateTo({
                    url: '../' + page + '/' + page + '?name=' + name + '&brand=' + brand + '&SBtype=choose&yid=' + JSON.parse(res.data).msg.yid
                  });
                }
              })
            } else {
              console.log('Fan1')
              page = 'Fan1'
              wx.sendSocketMessage({
                data: JSON.stringify({
                  "op": "device",
                  "act": "add",
                  "uid": that.data.uid,
                  "did": that.data.did,
                  "date": {
                    "dch": that.data.dch,
                    "dname": that.data.name,
                    "dloca": "default",
                    "online": "1",
                    "dlogo": 'Fan.svg',
                    "dbra": brand,
                    "dsys": that.data.dsys,
                    "dpanel": page
                  }
                })
              })
              wx.onSocketMessage(function (res) {
                console.log(JSON.parse(res.data));
                if (JSON.parse(res.data).ack == 0) {
                  wx.showModal({
                    title: '提示',
                    content: '添加设备失败' + JSON.parse(res.data).msg,
                  })
                } else if (JSON.parse(res.data).ack == 1) {
                  wx.navigateTo({
                    url: '../' + page + '/' + page + '?name=' + name + '&brand=' + brand + '&SBtype=choose&yid=' + JSON.parse(res.data).msg.yid
                  });
                }
              })
            }
          } else {
            wx.sendSocketMessage({
              data: JSON.stringify({
                "op": "device",
                "act": "add",
                "uid": that.data.uid,
                "did": that.data.did,
                "date": {
                  "dch": that.data.dch,
                  "dname": that.data.name,
                  "dloca": "default",
                  "online": "1",
                  "dlogo": that.data.page + '.svg',
                  "dbra": brand,
                  "dsys": that.data.dsys,
                  "dpanel": that.data.page
                }
              })
            })
            wx.onSocketMessage(function (res) {
              console.log(JSON.parse(res.data));
              if (JSON.parse(res.data).ack == 0) {
                wx.showModal({
                  title: '提示',
                  content: '添加设备失败' + JSON.parse(res.data).msg,
                })
              } else if (JSON.parse(res.data).ack == 1) {
                wx.navigateTo({
                  url: '../' + page + '/' + page + '?name=' + name + '&brand=' + brand + '&SBtype=choose&yid=' + JSON.parse(res.data).msg.yid
                });
              }
            })
          }
        }
      }
    })
  },
  search: function (e) {
    console.log(e)
    this.setData({
      serchName: e.detail.value
    })
  },
  searchWord: function () {
    console.log(this.data.serchName)
    let list = this.data.list;
    for (let i = 0; i < list.length; i++) {
      list[i].show = 0;
      if (list[i].brand.indexOf(this.data.serchName) != -1) {
        list[i].show = 1;
      }
    }
    this.setData({
      list: list
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