// pages/list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account: '',
    mobileSystem: '',
    list: [],
    pwdtype: 'text',
    pwd: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //判断手机型号
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        if (res.system.indexOf("Android") == -1) {
          console.log(1)
        } else {
          that.setData({
            mobileSystem: 'Android',
          })
        }
      }
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
    wx.startWifi({
      //判断是否打开Wi-Fi
      success: function (res) {
        console.log(wx.getConnectedWifi({
          success: function (res) {
            console.log('s', res.wifi.SSID)
            that.setData({
              account: res.wifi.SSID
            })
            console.log(that.data.account)
          },
          fail: function (res) {
            if (res.errCode == 12006) {
              wx.showModal({
                title: '未打开GPS',
                content: '获取Wi—Fi失败,请先启动GPS',
              })
            }
          },
          complete: function (res) {
            if (res.errCode == 12005) {
              wx.showModal({
                title: '未打开Wi—Fi',
                content: '获取Wi—Fi失败,请先启动Wi—Fi',
              })
            }
          },
        }))

      }
    })
  },
  wifiList: function () {
    //获取附近的wifi列表
    let that = this;
    if (this.data.list.length == 0) {
      wx.onGetWifiList(function (res) {
        console.log('wifiList', res)
        that.setData({
          list: res.wifiList
        })
      })
      wx.getWifiList()
    } else {
      that.setData({
        list: []
      })
    }



  },
  choseWifi: function (e) {
    //选择Wi-Fi
    console.log(e.target.dataset.str)
    this.setData({
      account: e.target.dataset.str,
      list: []
    })
  },
  hidPwd: function (e) {
    //显示隐藏密码
    if (this.data.pwdtype == 'text') {
      this.setData({
        pwdtype: 'password'
      })
    } else {
      this.setData({
        pwdtype: 'text'
      })
    }
    console.log(this.data)
  },
  getPwd: function (e) {
    //获取密码
    console.log(e.detail.value)
    this.setData({
      pwd: e.detail.value
    })
  },
  getaccount: function (e) {
    console.log(e.detail.value)
    this.setData({
      account: e.detail.value
    })
  },
  login: function (e) {
    let that = this;
    let ssid = this.data.account, pwd = this.data.pwd
    if (!ssid) {
      wx.showModal({
        title: '未选择Wi-Fi账号',
        content: '请先选择Wi-Fi账号',
      })
    } else if (!pwd) {
      wx.showModal({
        title: 'Wi—Fi密码不可为空',
        content: '请填写Wi-Fi密码',
      })
    } else {
      wx.setStorageSync("ssid", ssid);
      wx.setStorageSync("pwd", pwd);
      wx.navigateTo({
        url: '../second/second'
      });
    }

  }




})