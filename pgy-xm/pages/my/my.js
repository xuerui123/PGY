// pages/my/my.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid:'',
    did:'',
    hostImg:'',
    name:'',
    status:'',
    pr:''
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
        // that.qonline()   
        that.listsysinfo()
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
        "uid": that.data.uid,
        "did": that.data.did,
      })
    })
    wx.onSocketMessage(function (res) {
      console.log(JSON.parse(res.data));
      that.setData({
        hostImg: JSON.parse(res.data).msg.img,
        name: JSON.parse(res.data).msg.name,
        status: JSON.parse(res.data).msg.status,
        pr: JSON.parse(res.data).msg.pr
      })
    })
    
  },
  // qonline:function(){
  //   let that = this;
    
  //   wx.sendSocketMessage({
  //     data: JSON.stringify({
  //       "op": "mysys",
  //       "act": "qonline",
  //       "uid": that.data.uid,
  //       "did": that.data.did,
  //     })
  //   })
  //   wx.onSocketMessage(function (res) {
  //     console.log(JSON.parse(res.data));   
  //     that.setData({
  //       hostImg: JSON.parse(res.data).msg.img,
  //       name: JSON.parse(res.data).msg.name,
  //       status: JSON.parse(res.data).msg.status,
  //       pr: JSON.parse(res.data).msg.pr
  //     })   
  //   })
  // },
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