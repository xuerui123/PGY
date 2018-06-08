// pages/QMKG/QMKG.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SBtype:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      SBtype:options.SBtype
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
  
  },
  gopage:function(e){
    let that = this;
    console.log(e.currentTarget.dataset.num)
    wx.setStorage({
      key: 'kaiguan',
      data: [{ weizhi: 1, content: { dname: '', dcap: "86switch1" } }, { weizhi: 2, content: { dname: '', dcap: "86switch2" } }, { weizhi: 3, content: { dname: '', dcap: "86switch3"} }],
    })
    wx.navigateTo({
      url: '../SwitchOne/SwitchOne?num=' + e.currentTarget.dataset.num + '&SBtype='+that.data.SBtype
    });
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