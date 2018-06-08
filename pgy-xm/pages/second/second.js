// pages/second/second.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showType:1
  },
  networking:function(){
    
    wx.navigateTo({
      url: '../third/third'
    });
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
  
  },

  changeModal:function(){
    this.setData({
      showType:2
    })
  },
  modalOk:function(){
    this.setData({
      showType: 1
    })
  }
})