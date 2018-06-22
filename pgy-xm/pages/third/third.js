Page({
  data: {
    animationData: {},
    music: '',
    a: true,
    did:'',
    audioCtx: {},
    mobileSystem: '',
    status:1
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
  },
  onLoad: function () {
    this.login();
  },
  onHide: function () {
    if (that.data.mobileSystem != 'Android') {
      wx.pauseBackgroundAudio()
    } else {
      that.audioCtx.pause();
    }
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
      that.setData({status:1})
      let music = JSON.parse(res.data).msg;      
      if (that.data.mobileSystem != 'Android') {
        wx.playBackgroundAudio({
          dataUrl: music,
          title: '11',
          coverImgUrl: ''
        })
      }else{
        console.log(that.audioCtx)
        that.audioCtx.setSrc(that.data.music);
        that.audioCtx.play();
        that.setData({
          music: music
        })
      } 

      setTimeout(function () {        
        console.log(333)
        clearInterval(timer)
        if (that.data.mobileSystem != 'Android') {
          wx.pauseBackgroundAudio()
        }else{
          that.audioCtx.pause();
        }
        if(that.data.did==''){
          wx.showModal({
            title: '联网失败',
            content: '请检查Wi-Fi账号密码是否输入错误，家里网络是否通畅',
            
          })
          
        }                        
      }, 60000)
      console.log(that.data)
      let timer = ''
      if (JSON.parse(res.data).ack == 1) { //联网请求成功                           
        let openId = wx.getStorageSync("openid");
        timer = setInterval(function () {
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
              that.setData({ did: JSON.parse(res.data).msg.did,status:2})
              wx.setStorageSync("did", JSON.parse(res.data).msg.did);
              that.audioCtx.pause();
              wx.pauseBackgroundAudio();
              wx.switchTab({
                url: '../home/home',
                complete:function(res){
                  console.log(res)
                }
              })
              clearInterval(timer)
              
            }
          })
        }, 3000)
      } 
    })
  }
})