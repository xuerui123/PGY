// pages/ZNMS/ZNMS.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuShow: true,
    hideNum: false,
    roomList: [
      '客厅', 'wdf'
    ]
  },
  gopage: function (e) {
    console.log(e)
    let str = e.currentTarget.dataset.str
    wx.navigateTo({
      url: '../' + str + '/' + str
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
  showMenu: function () {
    this.setData({
      menuShow: !this.data.menuShow
    })
  },
  changeWord: function () {
    this.setData({
      menuShow: !this.data.menuShow,
      wordShow: !this.data.wordShow
    })
  },
  wordConfirm: function (e) {
    //提交
    this.changeWord()
  },
  wordCancel: function () {
    //取消
    this.changeWord()
  },
  hostName: function (e) {
    //修改管家唤醒词
    console.log(e.detail.value)
  },
  showRoomList: function () {
    this.setData({
      menuShow: !this.data.menuShow,
      hideNum: !this.data.hideNum,
    })
  },
  delEquipment: function () {
    wx.showModal({
      title: '提示',
      content: '删除这个设备',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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