// pages/establish/establish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startimes: '00:00',
    endtimes: '23:59',
    flag: true,
    listnum: 2,
    off: true,
    uid: '',
    did: '',
    makeList: [
      {
        id: 'voice',
        name: '语音回复',
        pstr: '请输入您要管家说的话',
        list: [
          '欢迎主人回家', '主人辛苦了', '好的陛下', '主人一路顺风'
        ]
      },
      {
        id: 'furnishing',
        name: '智能家居',
        pstr: '请输入您要对管家做的事',
        list: [
          '打开客厅空调', '打开加湿器', '打开客厅窗帘', '关闭客厅筒灯'
        ]
      },
      {
        id: 'music',
        name: '音乐',
        pstr: '请输入您要管家播放的歌曲',
        list: [
          '播放周杰伦的歌', '播放丑八怪', '播放张学友的祝福', '播放轻音乐'
        ]
      },
      {
        id: 'story',
        name: '故事',
        pstr: '请输入您要管家播放的故事',
        list: [
          '播放白雪公主的故事', '收听凯叔讲故事', '收听英语故事', '收听皮皮鲁讲故事'
        ]
      },
      {
        id: 'weather',
        name: '天气',
        pstr: '请输入您要管家播放的天气',
        list: [
          '播报北京天气', '今天的天气', '播报明天的天气', '上海后天的天气'
        ]
      },
      {
        id: 'journalism',
        name: '新闻',
        pstr: '请输入您要管家播放的新闻',
        list: [
          '播放新闻', '我想听新闻', '收听体育新闻', '我想听科技新闻'
        ]
      },
      {
        id: 'radio',
        name: '电台',
        pstr: '请输入您要管家播放的电台',
        list: [
          '收听北京电台', '收听湖南潇湘之声', '收听国家电台', '收听音乐电台'
        ]
      },
      {
        id: 'other',
        name: '其他',
        pstr: '请输入您要管家做的事',
        list: [
          '讲个笑话', '收听相声', '床前明月光', '恐龙是什么'
        ]
      }
    ],
    sence: {},
    sid:'',
    ifList: [],
    doList: [],
    promptNnum: 1,
    senceName: '',
    senceType:'',
    repeat: '',
    mode: '',
    date: '',
    time: '',
  },
  bindStarTime: function (e) {
    this.setData({
      startimes: e.detail.value
    })
  },
  bindEndTime: function (e) {
    this.setData({
      endtimes: e.detail.value
    })
  },
  changeSenceName: function (e) {
    this.setData({
      senceName: e.detail.value
    })
  },
  showCondition: function (e) {
    let num = e.currentTarget.dataset.num
    if (this.data.flag) {
      this.setData({
        flag: false,
        listnum: num
      })
    } else {
      this.setData({
        flag: true,

      })
    }
  },
  nexus: function (e) {
    //选择满足条件其一或同时
    console.log(e.currentTarget.dataset.num)
    this.setData({
      promptNnum: e.currentTarget.dataset.num
    })
  },
  sceneSet: function (e) {
    console.log(e)

    let id = e.currentTarget.dataset.id;
    let list = this.data.makeList;
    console.log(id)
    console.log(list)
    let that = this;
    for (let i = 0; i < list.length; i++) {
      if (id == list[i].id) {
        if (this.data.off) {
          that.setData({
            off: false
          })
          wx.setStorage({
            key: "obj",
            data: list[i],
            success: function () {
              that.setData({
                off: true
              })
              wx.navigateTo({
                url: '../sceneSet/sceneSet'
              })
            }
          })
        }
      }
    }
  },
  goPage: function (e) {
    console.log(e)
    let str = e.currentTarget.dataset.page
    wx.navigateTo({
      url: '../' + str + '/' + str
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this;
    this.setData({
      senceType: options.type ? options.type: ''
    })
    if (!options.type){
      
    }else(
      wx.getStorage({
        key: 'sence',
        success: function(res) {
          let obj = res.data;          
          let actionList = obj.action.split(',');
          let sevList = obj.sev.split(',');
          let timedo = obj.timedo.split(';')
          let time = {};
          for(let i=0;i<timedo.length;i++){
            console.log(timedo[i].substring(timedo[i].indexOf(':'), timedo[i].length))
            time[timedo[i].substring(0, timedo[i].indexOf(':'))] = timedo[i].substring(timedo[i].indexOf(':') + 1, timedo[i].length)            
          }
          
          let num = [], action = [], sev = [], devlist = [];       
          wx.sendSocketMessage(
            {
              data: JSON.stringify({
                "op": "device",
                "act": "list",
                "uid": that.data.uid,
                "did": that.data.did,
                "date": {}
              })
            })
          wx.onSocketMessage(function (res) {
            // console.log(JSON.parse(res.data).msg)
            devlist = JSON.parse(res.data).msg.devlist;            
            for (let i = 0; i < actionList.length; i++) {
              if (typeof (parseInt(actionList[i]) == 'number')) {
                num.push(actionList[i])
                actionList.splice(i, 1)
              }
            }
            for (let i = 0; i < actionList.length; i++) {
              action.push({
                name: actionList[i],
                time: num[i]
              })
            }
            for (let i = 0; i < action.length; i++) {
              if (action[i].name.indexOf('tts') != -1) {
                action[i].tts = 'tts'
                action[i].name = action[i].name.split('tts')[1]
              }
            }
            for (let i = 0; i < sevList.length; i++) {
              sev.push({
                yid: sevList[i].split('_')[0],
                str: sevList[i].split('_')[1]
              })
            }            
            for (let i = 0; i < devlist.length; i++) {
              for (let a = 0; a< sev.length;a++) {
                if (devlist[i].yid == sev[a].yid) {
                  console.log(devlist[i])
                  sev[a].loca = devlist[i].dloca;
                  sev[a].name = devlist[i].dname;
                }
              }
            }
            for (let i = 0 ;i< sev.length;i++){
              console.log(sev[i].str)
              if (sev[i].str.indexOf('open') != -1){
                sev[i].str='打开'
              } else if (sev[i].str.indexOf('close') != -1) {
                sev[i].str = '关闭'
              } else if (sev[i].str.indexOf('move') != -1) {
                sev[i].str = '人体活动'
              } else if (sev[i].str.indexOf('temH') != -1) {
                sev[i].num = sev[i].str.split('temH')[1]
                sev[i].str = '温度高于'                
              } else if (sev[i].str.indexOf('temL') != -1) {
                sev[i].num = sev[i].str.split('temL')[1]
                sev[i].str = '温度低于'
              } else if (sev[i].str.indexOf('humH') != -1) {
                sev[i].num = sev[i].str.split('hunH')[1]
                sev[i].str = '湿度高于'
              } else if (sev[i].str.indexOf('humL') != -1) {
                sev[i].num = sev[i].str.split('hunL')[1]
                sev[i].str = '湿度低于'
              } else if (sev[i].str.indexOf('lumiH') != -1) {                
                sev[i].str = '光线过亮'
              } else if (sev[i].str.indexOf('lumiL') != -1) {
                sev[i].str = '光线过暗'
              }
            }            
            let sence = {
              sid:obj.sid,
              senceName: obj.sna,
              action:action,
              sev:sev,
              startimes: obj.timearea.split('-')[0],
              endtimes: obj.timearea.split('-')[1],
              repeat: time.repeat,
              mode: time.mode,
              date: time.date,
              time: time.time,
              svc:obj.svc,
              sevc:obj.sevc,
              evindp:obj.evindp
            }
            let ifList = [];
            let doList = [];
            console.log(sence)
            if (!sence.svc) {

            } else {
              let arr = [];
              let svc = sence.svc+','                                          
              arr = svc.split(',');
              console.log(arr)
              for (let i = 0; i < arr.length; i++) {
                ifList.push({
                  name: arr[i],
                  type: 'tts'
                })
                if (ifList[i].name==''){
                  ifList.splice(i,1)
                }
              }
              
            }
            if (!sence.sev) {

            } else {
              for (let i = 0; i < sence.sev.length; i++) {
                console.log(sence.sev[i])
                let num = sence.sev[i].num ? sence.sev[i].num : ''
                let str = sence.sev[i].loca + sence.sev[i].name + sence.sev[i].str + num;
                ifList.push({
                  name: str,
                  str:sence.sev[i].str,
                  num:num,
                  yid: sence.sev[i].yid,
                  type: 'action'
                })
              }
            }
            if (!sence.action) {

            } else {
              doList = sence.action;
            }
            if (!sence.time) {

            } else {
              let str = ''
              let arr = sence.date.split(',')
              for (let i = 0; i < arr.length; i++) {
                if (arr[i] == 1) { arr[i] = '一' }
                else if (arr[i] == 2) {
                  arr[i] = '二'
                } else if (arr[i] == 3) {
                  arr[i] = '三'
                } else if (arr[i] == 4) {
                  arr[i] = '四'
                } else if (arr[i] == 5) {
                  arr[i] = '五'
                } else if (arr[i] == 6) {
                  arr[i] = '六'
                } else if (arr[i] == 7) {
                  arr[i] = '日'
                }
              }
              console.log(arr.toString())
              let s = arr.toString()
              str = '定时周' + s.slice(0, s.length) + '开启'
              ifList.push({
                name: str,
                type: 'time'
              })
            }           
            that.setData({
              sid: sence.sid,
              senceName: sence.senceName,
              startimes: sence.startimes,
              endtimes: sence.endtimes,
              ifList: ifList,
              doList: doList,
              svc: sence.svc,
              sevc: sence.sevc,
              evindp: sence.evindp,
              repeat: sence.repeat,
              mode: sence.mode,
              date: sence.date,
              time: sence.time,
            })
            console.log(that.data)
            wx.setStorage({
              key: 'sence',
              data: sence,
            })
          })          
        },
      })
    )
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
      key: 'did',
      success: function (res) {
        console.log(1)
        console.log(res)
        that.setData({
          did: res.data,
        })
      }
    });
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        console.log(1)
        console.log(res)
        that.setData({
          uid: res.data,
        })
      }
    });
    
    if (this.data.senceType == ''){
      wx.getStorage({
        key: 'sence',
        success: function (res) {
          console.log(res)
          let sence = res.data;
          let ifList = [];
          let doList = [];
          if (!sence.svc) {

          } else {
            let arr = [];
            let svc = sence.svc;
            arr = svc.split(',');
            console.log(arr)
            for (let i = 0; i < arr.length; i++) {
              ifList.push({
                name: arr[i],
                type: 'tts'
              })              
            }

          }
          if (!sence.sev) {

          } else {
            for (let i = 0; i < sence.sev.length; i++) {
              console.log(sence.sev[i])
              let num = sence.sev[i].num ? sence.sev[i].num : ''
              let str = sence.sev[i].loca + sence.sev[i].name + sence.sev[i].str + num;
              ifList.push({
                name: str,
                str: sence.sev[i].str,
                num: num,
                yid: sence.sev[i].yid,
                type: 'action'
              })
            }
          }
          if (!sence.action) {

          } else {
            doList = sence.action;
          }
          if (!sence.time) {

          } else {
            let str = ''
            let arr = sence.date.split(',')
            for (let i = 0; i < arr.length; i++) {
              if (arr[i] == 1) { arr[i] = '一' }
              else if (arr[i] == 2) {
                arr[i] = '二'
              } else if (arr[i] == 3) {
                arr[i] = '三'
              } else if (arr[i] == 4) {
                arr[i] = '四'
              } else if (arr[i] == 5) {
                arr[i] = '五'
              } else if (arr[i] == 6) {
                arr[i] = '六'
              } else if (arr[i] == 7) {
                arr[i] = '日'
              }
            }
            console.log(arr.toString())
            let s = arr.toString()
            str = '定时周' + s.slice(0, s.length) + '开启'
            ifList.push({
              name: str,
              type: 'time'
            })
          }
          for(let i=0;i<ifList.length;i++){
            if (ifList[i].name == '') {
              ifList.splice(i, 1)
            }
          }
          that.setData({                                                
            ifList: ifList,
            doList: doList,
            svc: sence.svc,
            sevc: sence.sevc,            
            repeat: sence.repeat ? sence.repeat:'',
            mode: sence.mode ? sence.mode:'',
            date: sence.date ? sence.date:'',
            time: sence.time ? sence.time:'',
          })
        },
      })  
    }
    
  },
  addSence: function () {
    console.log(this.data.ifList)   
    this.setData({svc:''}) 
    let that = this;
    let sev = that.data.ifList;
    let sevstring = '';
    console.log(sev)
    for (let i = 0; i < sev.length; i++) {
      if (sev[i].str == '打开') {
        sev[i].str = 'open,'
      } else if (sev[i].str == '关闭') {
        sev[i].str = 'close,'
      } else if (sev[i].str == '关闭') {
        sev[i].str = 'close,'
      } else if (sev[i].str == '温度高于') {
        sev[i].str = 'temH' + sev[i].num + ','
      } else if (sev[i].str == '温度低于') {
        sev[i].str = 'temL' + sev[i].num + ','
      } else if (sev[i].str == '湿度高于') {
        sev[i].str = 'humH' + sev[i].num + ','
      } else if (sev[i].str == '湿度低于') {
        sev[i].str = 'humL' + sev[i].num + ','
      } else if (sev[i].str == '光线过亮') {
        sev[i].str = 'lumiH' + 60 + ','
      } else if (sev[i].str == '光线过暗') {
        sev[i].str = 'lumiH' + 30 + ','
      } else if (sev[i].str == '人体活动') {
        sev[i].str = 'move,'
      }
      if(sev[i].type=='action'){
        sevstring = sevstring + sev[i].yid + '_' + sev[i].str
      }else if(sev[i].type=='tts'){           
        that.setData({
          svc:that.data.svc + ',' + sev[i].name 
        })
      }
      
    }
    if(that.data.svc[0]==','){
      let svc = that.data.svc.substring(1);
      this.setData({
        svc : svc
      })
    }
    
    let doList = that.data.doList;
    let action = '';
    for (let i = 0; i < doList.length; i++) {
      let tts = doList[i].tts ? doList[i].tts : ''
      action = action + doList[i].time + ',' + tts + doList[i].name + ','
    }
    console.log(that.data)
    let repeat = that.data.repeat ? that.data.repeat : '';
    let mode = that.data.mode ? that.data.mode : '';
    let time = that.data.time ? that.data.time : '';
    let day =  ''
    if (that.data.date[that.data.date.length-1]==','){
      day = that.data.date.substring(0, that.data.date.length - 1)
    }else{
      day = that.data.date
    }
    let timedo = 'repeat:' + repeat + ';mode:' + mode + ';date:'+ day+';time:' + time
    console.log(timedo)
    let date = {
      sna: that.data.senceName,
      timearea: that.data.startimes + '-' + that.data.endtimes,
      svc: that.data.svc,
      sev: sevstring.slice(0, sevstring.length - 1),
      timedo:timedo,
      sevc: that.data.sevc,
      evindp: that.data.promptNnum,
      action: action.slice(0, action.length - 1)
    }
    console.log(date)
    if (date.sna == '') {
      wx.showModal({
        title: '提示',
        content: '场景名为必填项，不可为空',
      })
    } else {
      console.log(that.data.senceType == 'updata')
      if (that.data.senceType ==''){
        wx.sendSocketMessage({
          data: JSON.stringify({
            "op": "scene",
            "act": "add",
            "uid": that.data.uid,
            "did": that.data.did,
            "date": date
          })
        })
        wx.onSocketMessage(function (res) {
          console.log(res)          
        })
      }else{
        date.sid = that.data.sid;
        console.log(date)
        wx.sendSocketMessage({
          data: JSON.stringify({
            "op": "scene",
            "act": "updata",
            "uid": that.data.uid,
            "did": that.data.did,
            "date": date
          })
        })
        wx.onSocketMessage(function (res) {
          console.log(res)
        })        
      }
      
    }

  },
  delif:function(e){
    let that = this;
    let i = e.currentTarget.dataset.i;
    wx.showModal({
      title: '提示',
      content: '确认删除该事件',
      success: function (res) {
        if (res.confirm) {
          let arr = that.data.ifList;
          if(arr[i].type=='action'){
            arr.splice(i, 1)
            that.setData({
              ifList: arr
            })
          }else if(arr[i].type=='time'){
            arr.splice(i, 1)
            that.setData({
              ifList: arr,
              repeat: '',
              mode: '',
              date: '',
              time: '',
            })
          } else if (arr[i].type=='tts'){
            arr.splice(i, 1)
            that.setData({
              ifList: arr
            })
          }
          // arr.splice(e.currentTarget.dataset.i, 1)
          // that.setData({
          //   ifList: arr
          // })
        }
      }
    })
  },
  deldo:function(e){
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确认删除该动作',
      success: function (res) {
        if (res.confirm) {
          let arr = that.data.doList;
          arr.splice(e.currentTarget.dataset.i, 1)
          that.setData({
            doList: arr
          })
        }
      }
    })
  },
  delSence:function(){
    let that = this;
    if(this.data.senceType=='updata'){
      wx.showModal({
        title: '提示',
        content: '确认删除该场景？一旦删除无法恢复',
        success:function(res){
          if(res.confirm){
            wx.sendSocketMessage({
              data: JSON.stringify({
                "op": "scene",
                "act": "del",
                "uid": that.data.uid,
                "did": that.data.did,
                "date": {
                  sid: that.data.sid
                }
              })
            })
            wx.onSocketMessage(function (res) {
              console.log(res)
              if (JSON.parse(res.data).ack == 1) {
                wx.showToast({
                  title: '删除成功',
                })
                wx.navigateBack({})
              }
            })
          }
        }
      })      
    }else{
      wx.navigateBack({})
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