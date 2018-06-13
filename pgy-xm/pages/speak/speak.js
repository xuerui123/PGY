// pages/speak/speak.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:'',
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
  changeValue:function(e){
    console.log(e)
    this.setData({
      value: e.currentTarget.dataset.str
    })
  },
  setValue:function(e){
    console.log(e)    
    this.setData({
      value: e.detail.value
    })
  },
  conserve:function(){
    let han = /^[\u4e00-\u9fa5]+$/;
    let str = this.data.value;
    if (!han.test(str)) {
      console.log(11111)
      wx.showModal({
        title: '提示',
        content: '只能输入中文字符',        
      })
    } else {
      let sence = {} ;
      wx.getStorage({
        key: 'sence',
        success: function(res) {
          sence= res.data;                    
          sence.svc = sence.svc ? sence.svc : ''
          sence.svc = sence.svc + str + ',';          
          wx.setStorage({
            key: 'sence',
            data: sence,
          })
          wx.navigateBack({})
        },
        fail:function(res){
          console.log(res)
          let sence={};
          sence.svc =  str + ',';
          console.log(sence)
          wx.setStorage({
            key: 'sence',
            data: sence,
          })
          wx.navigateBack({})
        }        
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