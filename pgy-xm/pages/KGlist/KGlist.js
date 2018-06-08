// pages/KGlist/KGlist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: '',
    name: "",
    uid: '',
    did: '',
    logo: '',
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
    this.setData({
      num: options.num
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
  chose: function (e) {    
    this.setData({
      name: e.currentTarget.dataset.str,
      logo: e.currentTarget.dataset.logo
    })
  },
  diyName: function (e) {    
    this.setData({
      name: e.detail.value
    })
  },
  conserve: function () {
    let that = this;
    let kaiguan = [] ;
    let num = this.data.num;
    
    wx.getStorage({
      key: 'kaiguan',
      success: function (res) {        
        kaiguan=res.data
        for (let i = 0; i < kaiguan.length; i++) {        
          if (kaiguan[i].weizhi == num) {            
            kaiguan[i].content.dch=11;
            kaiguan[i].content.dname= that.data.name;
            kaiguan[i].content.dloca= "default";
            kaiguan[i].content.dpanel = "Lamp";
            kaiguan[i].content.dlogo = that.data.logo;
            kaiguan[i].content.dcap = "86switch" + that.data.num;            
          }
        }
        wx.setStorage({
          key: 'kaiguan',
          data: kaiguan,
        })
        wx.navigateBack()
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