//app.js
App({
  onLaunch: function () {
    // 登录

  },
  onShow: function () {
    wx.connectSocket({
      url: 'wss://xqwxmp.cspugoing.com:4431'
    })
    wx.onSocketOpen(function (res) {
      wx.getStorage({
        key: 'openid',
        success: function (res) {
          console.log('^*&^^^&*^*^&^&^&*^&*^')
          wx.sendSocketMessage(
            {
              data: JSON.stringify({
                "op": "heart",
                "uid": res.data,
              })
            })
        }
      });
    })
    wx.onSocketClose(function (res) { // 监听WebSocket关闭。
      console.log('WebSocket关闭');
      wx.connectSocket({
        url: 'wss://xqwxmp.cspugoing.com:4431'
      })
    })
    wx.onSocketError(function (res) {
      console.log(res)
      wx.connectSocket({
        url: 'wss://xqwxmp.cspugoing.com:4431'
      })
    })
    wx.login({
      success: function (res) {
        let code = res.code;
        wx.getUserInfo({
          success: function (res) {
            console.log(res)
            let img = res.userInfo.avatarUrl, name = res.userInfo.nickName;
            wx.sendSocketMessage({
              data: JSON.stringify({
                "op": "mysys",
                "act": "getuid",
                "date": {
                  userName: name ,
                  userImg: img ,
                  code: code
                }
              })
            })
            wx.onSocketMessage(function (res) { //获取返回数据
              let openid = JSON.parse(res.data).msg.uid
              console.log(JSON.parse(res.data).msg.uid)
              wx.setStorageSync("openid", openid);
              wx.sendSocketMessage({
                data: JSON.stringify({
                  "op": "mysys",
                  "act": "listrobot",
                  "uid": openid
                })
              })
              wx.onSocketMessage(function (res) {                
                let robotlisy = JSON.parse(res.data).msg
                if (robotlisy.length != 0) {
                  console.log('&(*&*&',robotlisy.length)
                  let did = '';
                  for(let i =0; i<robotlisy.length;i++){
                    if(robotlisy[i].use==1){
                      did = robotlisy[i].device_id
                      wx.setStorageSync("did", did);
                      console.log(did)
                    }
                  }
                }else{                
                  wx.navigateTo({
                    url: '../../pages/index/index',
                  })
                }
              })
            })
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onHide: function () {
    console.log('123456onhide')
    wx.closeSocket()
  },
  globalData: {
    userInfo: null
  }
})

//time : 2018.3.27