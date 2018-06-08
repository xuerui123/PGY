// pages/my/my.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
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
        console.log(res.data)
        that.setData({
          uid:res.data
        }) 
      }
    })
    wx.getStorage({
      key: 'did',
      success: function (res) {
        that.setData({
          did: res.data
        }) 
        that.listsysinfo()
        that.qonline()   
      }
    })
    
  },
  goview(e){    
    let page = e.currentTarget.dataset.page;
    console.log(page)
    wx.navigateTo({
      url: '../'+page+'/'+page
    })
  },
  listsysinfo: function () {
    let that = this;
    wx.sendSocketMessage({
      data: JSON.stringify({
        "op": "mysys",
        "act": "listsysinfo",
        "uid": 'oNpl_wVYukIxDCvXQsTgKYnTiasU',
        "did": "30373331323031313164313830303737",
      })
    })
    wx.onSocketMessage(function (res) {
      console.log(JSON.parse(res.data));
    })
  },
  qonline:function(){
    let that = this;
    wx.sendSocketMessage({
      data: JSON.stringify({
        "op": "mysys",
        "act": "qonline",
        "uid": 'oNpl_wVYukIxDCvXQsTgKYnTiasU',
        "did": "30373331323031313164313830303737",
      })
    })
    wx.onSocketMessage(function (res) {
      console.log(JSON.parse(res.data));      
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
})