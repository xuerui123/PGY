// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid:'',
    did:'',
    imageSrc:'',
    name:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getStorage({
      key: 'did',
      success: function (res) {
        console.log(1)
        console.log(res)
        that.setData({
          did: res.data,
        })
      }
    });
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        console.log(1)
        console.log(res)
        that.setData({
          uid: res.data,
        })
        that.listsysinfo()
      }
    });
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
   
  },
  listsysinfo:function(){
    let that = this;
    wx.sendSocketMessage(
      {
        data: JSON.stringify({
          "op": "mysys",
          "act": "listsysinfo",
          "uid": that.data.uid,
          "did": that.data.did,
        })
      })
    wx.onSocketMessage(function (res) {
      console.log(JSON.parse(res.data));
      that.setData({
        name: JSON.parse(res.data).msg.name,
        imageSrc: JSON.parse(res.data).msg.img
      })
    })
  },
  addPhoto: function () {
    let that = this;
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认1
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        var imgsrc = res.tempFilePaths;        
        console.log(imgsrc)
        that.setData({
          imageSrc: imgsrc[0]
        })        
        wx.uploadFile({
          url: 'http://hotel.xq.cspugoing.com/api/upload',
          filePath: imgsrc[0],
          name: 'file',
          formData: {
            'user': 'test'
          },
          success: function (res) {
            console.log(JSON.parse(res.data))
            that.setData({
              imageSrc: JSON.parse(res.data).msg
            })  
            wx.showToast({
              title: '图片上传成功',
              icon: 'success',
              duration: 1000
            })
          }, fail: function (res) {
            console.log(res)
          }
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  hostName:function(e){
    console.log(e.detail.value)
    this.setData({
      name: e.detail.value
    })
  },
  host:function(){
    let that = this;
    wx.sendSocketMessage({
      data: JSON.stringify({
        "op": "host",
        "act": "update",
        "uid": that.data.uid,
        "did": that.data.did,
        "date":{
          img:this.data.imageSrc,
          name:this.data.name
        }
      })
    })
    wx.onSocketMessage(function (res) {
      console.log(JSON.parse(res.data));
      // that.setData({
      //   clockList: JSON.parse(res.data).msg
      // })
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