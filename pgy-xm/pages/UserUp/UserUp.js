// pages/UserUp/UserUp.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showStatus:false,
    name:'',
    page:'',
    brand:'',
    num:'',
    nick:''
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
  lookList:function(){
    this.setData({
      showStatus: !this.data.showStatus
    })
  },
  choseName:function(e){
    this.setData({
      name: e.currentTarget.dataset.str,
      page: e.currentTarget.dataset.page,
      showStatus: !this.data.showStatus
    })
  },
  addbrand:function(e){
    this.setData({
      brand:e.detail.value
    })
  },
  addnum: function (e) {
    this.setData({
      num: e.detail.value
    })
  },
  addnick: function (e) {
    this.setData({
      nick: e.detail.value
    })
  },
  next:function(){
    let page = this.data.page;
    let brand = this.data.brand;
    let num = this.data.num;
    let nick = this.data.nick;
    wx.navigateTo({
      url: '../' + page + '/' + page
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