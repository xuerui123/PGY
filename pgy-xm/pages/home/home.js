// pages/home/home.js
Page({
  /**
   * 页面的初始数据
   */
  data: {        
    msgList: [
      { a: 1111 },
      { a: 2222 },
      { a: 3333 }
    ],
    chatList: [],
    sendText: '',
    toView: '',
    uid:'',
    did:'',
    windowHeight: 0,
    userImg:''
  },
  domsg: function (e) {
    console.log(e.detail.value)
    this.setData({
      sendText: e.detail.value
    })
  },
  send: function () {
    let that = this;
    let list = this.data.chatList;

    if (!this.data.sendText.replace(/(^\s*)|(\s*$)/g, "")) {
      this.tip('发送内容不能为空')
    } else {      
      console.log('uid',that.data.uid)
      console.log('did',that.data.did)
      wx.sendSocketMessage({
        data: JSON.stringify({
          "op":"textctrl",
           "act":"send",
          "uid": that.data.uid,
          "did": that.data.did,
          "date": {
            "msg": that.data.sendText,
            "fm":"1"
          }
        }),
        success:(res)=>{
          list.push({
            man: 'user',
            type: 'text',
            content: that.data.sendText
          })
          that.setData({
            sendText: '',
            chatList: list
          })
          setTimeout(function () {
            that.setData({
              toView: 'weizhi'
            })
          }, 1)
          wx.setStorage({
            key: 'chatList',
            data: list,
          })
        }
        
      })                            
      wx.onSocketMessage(function (res) {
        console.log(JSON.parse(res.data));
        if (JSON.parse(res.data).op =='textctrl'){          
          list.push({
            man: 'xq',
            type: JSON.parse(res.data).date.msg.type,
            content: JSON.parse(res.data).date.msg.content
          })
          that.setData({
            chatList: list
          })
          setTimeout(function () {
            that.setData({
              toView: 'weizhi'
            })
          }, 1)
        }else{
          console.log(JSON.parse(res.data))
          list.push({
            man: 'xq',
            type: 'text',
            content: JSON.parse(res.data).msg.data.text
          })
          that.setData({
            chatList: list
          })
          setTimeout(function () {
            that.setData({
              toView: 'weizhi'
            })
          }, 1)
          wx.setStorage({
            key: 'chatList',
            data: list,
          })
        }
        
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
    let that = this;
    
    this.recorderManager = wx.getRecorderManager();
    this.recorderManager.onError(function () {
      that.tip("录音失败！")
    });
    this.recorderManager.onStop(function (res) {
      that.setData({
        src: res.tempFilePath
      })
      console.log(res.tempFilePath)
      let list = that.data.chatList;
      list.push({
        man: 'user',
        type: 'mp3',
        content: res.tempFilePath
      })
      that.setData({
        chatList: list
      })
      that.tip("录音完成！")
    });

    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.onError((res) => {
      console.log(res)
      that.tip("播放录音失败！")
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
    wx.getStorage({
      key: 'userImg',
      success: function (res) {
        that.setData({
          userImg: res.data
        })
      },
    })
    wx.getStorage({
      key: 'chatList',
      success: function (res) {
        that.setData({
          chatList: res.data
        })
      }
    })
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          uid: res.data
        })
      }
    })    
    wx.getStorage({
      key: 'did',
      success: function (res) {
        that.setData({
          did: res.data
        })        
        console.log('did',res.data)
      }
    })
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          windowHeight: parseInt(res.windowHeight)-55 + 'px',
          toView: 'weizhi',
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
        });
      }
    });
  },
  onHide: function () {
    
  },
  goPage: function () {
    wx.navigateTo({
      url: '../clock/clock'
    })
  },
  touchdown: function () {
    console.log("手指按下了...")
    console.log("new date : " + new Date)
    let that = this;
    //开始录音  
    wx.startRecord({
      success: function (res) {
        //临时路径,下次进入小程序时无法正常使用  
        var tempFilePath = res.tempFilePath
        //持久保存  
        wx.saveFile({
          tempFilePath: tempFilePath,
          success: function (res) {
            //持久路径  
            //本地文件存储的大小限制为 100M  
            var savedFilePath = res.savedFilePath
            console.log("savedFilePath: " + savedFilePath)
            let list = that.data.chatList;
            list.push({
              man: 'user',
              type: 'mp3',
              content: savedFilePath
            })
            that.setData({
              chatList: list
            })
            console.log(that.data)
          }
        })
        wx.showToast({
          title: '恭喜!录音成功',
          icon: 'success',
          duration: 1000
        })
        //获取录音音频列表  
        wx.getSavedFileList({
          success: function (res) {
            console.log(res)
          }
        })
      },
      fail: function (res) {
        //录音失败  
        wx.showModal({
          title: '提示',
          content: '录音的姿势不对!',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              return
            }
          }
        })
      }
    })
  },
  //手指抬起  
  touchup: function () {
    console.log("手指抬起了...")
    clearInterval(this.timer)
    wx.stopRecord()
  },
  playMp3: function (e) {
    var filePath = e.currentTarget.dataset.key;
    console.log(filePath)
    //点击开始播放  
    wx.showToast({
      title: '开始播放',
      icon: 'success',
      duration: 1000
    })
    wx.playVoice({
      filePath: filePath,
      success: function () {
        wx.showToast({
          title: '播放结束',
          icon: 'success',
          duration: 1000
        })
      }
    })
  },
  tip: function (msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false
    })
  }
})