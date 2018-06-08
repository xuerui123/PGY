
Page({
  data: {
    animationData: {},
    music: '',
    a: true,
    audioCtx: {},
    mobileSystem: ''
  },
  onShow: function () {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        if (res.system.indexOf("Android") == -1) {
          console.log(1)
          wx.onBackgroundAudioStop(function (res) {
            console.log(res)
            wx.playBackgroundAudio({
              dataUrl: res.dataUrl,
              title: '11',
              coverImgUrl: ''
            })
          })
        } else {
          that.setData({
            mobileSystem: 'Android',
          })
          that.audioCtx = wx.createAudioContext('netWav')
        }
      }
    })
    var animation = wx.createAnimation({
      duration: 3000,
      timingFunction: 'ease',
    })

    this.animation = animation

    // animation.scale(2, 2).rotate(15).step()

    this.setData({
      animationData: animation.export()
    })
    var n = 0;
    //连续动画需要添加定时器,所传参数每次+1就行
    setInterval(function () {
      // animation.translateY(-60).step()
      n = n + 1;
      // console.log(n);
      this.animation.rotate(360 * (n)).step()
      this.setData({
        animationData: this.animation.export()
      })
    }.bind(this), 1000)
  },
  onLoad: function () {
    this.login();
  },
  onHide: function () {
    wx.pauseBackgroundAudio()
  },
  gopage: function () {
    wx.switchTab({
      url: '../home/home'
    });
  },
  login: function () {
    let openId = wx.getStorageSync("openid");
    let ssid = wx.getStorageSync("ssid");
    let pwd = wx.getStorageSync("pwd");
    let that = this;
    wx.sendSocketMessage({
      data: JSON.stringify({
        "op": "mysys",
        "act": "setwifi",
        "uid": openId,
        "date": {
          "account": ssid,
          "pwd": pwd,
          "ref": "1"
        }
      })
    })
    wx.onSocketMessage(function (res) {
      console.log(JSON.parse(res.data));
      let music = JSON.parse(res.data).msg;
      console.log(that.audioCtx)
      that.audioCtx.setSrc(that.data.music);
      that.audioCtx.play();
      that.setData({
        music: music
      })

      if (that.data.mobileSystem != 'Android') {
        wx.playBackgroundAudio({
          dataUrl: music,
          title: '11',
          coverImgUrl: ''
        })
      } 

      setTimeout(function () {
        console.log(333)
        that.audioCtx.pause();
        wx.pauseBackgroundAudio()
      }, 60000)
      console.log(that.data)
      if (JSON.parse(res.data).ack == 1) { //联网请求成功                           
        let openId = wx.getStorageSync("openid");
        let timer = setInterval(function () {
          wx.sendSocketMessage({
            data: JSON.stringify({
              "op": "mysys",
              "act": "qbind",
              "uid": openId,
            })
          })
          wx.onSocketMessage(function (res) {
            console.log(res)
            if (JSON.parse(res.data).ack == 1) {
              wx.setStorageSync("did", JSON.parse(res.data).msg.did);
              that.audioCtx.pause();
              wx.pauseBackgroundAudio()              
              timer='';
              wx.navigateTo({
                url: '../home/home',
              })
            }
          })
        }, 3000)

      } else { //联网失败
        wx.showToast({
          title: '联网失败',
          icon: 'success',
          duration: 2000
        })
      }
    })
  }
})