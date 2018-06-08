// pages/KG/KG.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuShow: true,
    hideNum: '',
    num:'',
    uid:'',
    did:'',
    yid:'',
    kaiguan:[],
    SBtype:'',
    roomList: [],
    roomObj: {},
    btnName:'',
    btn1:'86SW_1OPEN',
    btn2: '86SW_2OPEN',
    btn3: '86SW_3OPEN'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options)
    if (!options.SBtype) {
      wx.getStorage({
        key: 'equipmentObj',
        success: function (res) {
          let roomObj = { name:res.data.dloca}          
          that.setData({
            yid: res.data.yid,
            roomObj: roomObj,
            num: res.data.dcap[res.data.dcap.length-1]
          })
          that.loadEQList()
        }        
      })
      setTimeout(function(){},1)      
    }else{
      this.setData({
        num: options.num,
        SBtype: options.SBtype
      })
    }
    
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
      }
    })    
    wx.getStorage({
      key: 'roomList',
      success: function (res) {
        that.setData({
          roomList: res.data,          
        })
      }
    });
    if (this.data.SBtype == 'add' || this.data.SBtype == 'update'){
      wx.getStorage({
        key: 'kaiguan',
        success: function (res) {
          that.setData({
            kaiguan: res.data
          })
          console.log(!that.data.kaiguan[0].content.dname)
        }
      })
    }        
  },
  gopage: function (e) {
    console.log(e);
    let that = this;
    let str = e.currentTarget.dataset.str;
    let weizhi = e.currentTarget.dataset.weizhi;    
    wx.navigateTo({
      url: '../' + str + '/' + str + '?num=' + weizhi
    });
  },
  conserve: function () {
    let that = this;    
    let kG = '',logo='';
    if (that.data.num == 1) {
      kG = '单开开关';
      logo = 'SwitchOne.svg';
    } else if (that.data.num == 2) {
      kG = '双开开关';
      logo = 'SwitchTwo.svg';
    } else if (that.data.num == 3) {
      kG = '三开开关';
      logo = 'SwitchThree.svg';
    }    
    if (this.data.SBtype == 'add'){
      wx.sendSocketMessage({
        data: JSON.stringify({
          "op": "device",
          "act": "add",
          "uid": that.data.uid,
          "did": that.data.did,
          "status": "more",
          "date": {
            "dch": 11,
            "dname": kG,
            "dloca": "default",
            "dlogo": logo,
            "dpanel": "SwitchOne",
            "dcap": "86sw" + that.data.num
          }
        })
      })
      wx.onSocketMessage(function (res) {
        console.log(JSON.parse(res.data));
        let arr = []     
        let kaiguan = that.data.kaiguan;
        kaiguan[0].content.mdid = JSON.parse(res.data).msg.yid;
        kaiguan[1].content.mdid = JSON.parse(res.data).msg.yid;
        kaiguan[2].content.mdid = JSON.parse(res.data).msg.yid;
        if (that.data.num == 1 ){
          arr = [{
            "op": "device",
            "act": "add",
            "uid": that.data.uid,
            "did": that.data.did,
            "status": "more",
            "date": kaiguan[0].content
          }]
          for (let i = 0; i < arr.length; i++) {

            wx.sendSocketMessage({
              data: JSON.stringify(arr[i])
            })
          }
          wx.onSocketMessage(function (res) {
            console.log(JSON.parse(res.data));
          })
        } else if (that.data.num==2){
          arr = [
            {
              "op": "device",
              "act": "add",
              "uid": that.data.uid,
              "did": that.data.did,
              "status": "more",
              "date": kaiguan[0].content
            },
            {
              "op": "device",
              "act": "add",
              "uid": that.data.uid,
              "did": that.data.did,
              "status": "more",
              "date": kaiguan[1].content
            }
          ] 
          for (let i = 0; i < arr.length; i++) {

            wx.sendSocketMessage({
              data: JSON.stringify(arr[i])
            })
          }
          wx.onSocketMessage(function (res) {
            console.log(JSON.parse(res.data));
          })
        }else if(that.data.num == 3){
          arr = [
            {
              "op": "device",
              "act": "add",
              "uid": that.data.uid,
              "did": that.data.did,
              "status": "more",
              "date": kaiguan[0].content
            },{
              "op": "device",
              "act": "add",
              "uid": that.data.uid,
              "did": that.data.did,
              "status": "more",
              "date": kaiguan[1].content
            }, {
              "op": "device",
              "act": "add",
              "uid": that.data.uid,
              "did": that.data.did,
              "status": "more",
              "date": kaiguan[2].content
            }
          ] 
          for (let i = 0; i < arr.length; i++) {

            wx.sendSocketMessage({
              data: JSON.stringify(arr[i])
            })
          }
          wx.onSocketMessage(function (res) {
            console.log(JSON.parse(res.data));
            wx.navigateBack({
              delta: 3
            })
          })
        }                                
      })
       
    }else if(this.data.SBtype == 'update'){
      let kaiguan = this.data.kaiguan;
      let arr = [{
        "op": "device",
        "act": "update",
        "uid": that.data.uid,
        "did": that.data.did,
        "status": "more",
        "date": {
          "dch": 11,
          "dname": kG,
          "dloca": "default",
          "dlogo": logo,
          "dpanel": "SwitchOne",
          "dcap": "86sw" + that.data.num
        }
      }];
      if (kaiguan[0].content.dname != '') {
        arr.push({
          "op": "device",
          "act": "update",
          "uid": that.data.uid,
          "did": that.data.did,
          "status": "more",
          "date":  kaiguan[0].content
        })
      }
      if (kaiguan[1].content.dname != '') {
        arr.push({
          "op": "device",
          "act": "update",
          "uid": that.data.uid,
          "did": that.data.did,
          "status": "more",
          "date": kaiguan[1].content
        })
      }
      if (kaiguan[2].content.dname != '') {
        arr.push({
          "op": "device",
          "act": "update",
          "uid": that.data.uid,
          "did": that.data.did,
          "status": "more",
          "date": kaiguan[2].content
        })
      }      
      console.log(arr)
      for (let i = 0 ; i<arr.length ; i++){
        wx.sendSocketMessage({data:JSON.stringify(arr[i])})
      }
      wx.onSocketMessage(function (res) {
        console.log(res)
      })
    }    
  },
  loadEQList:function(){
    let that = this;
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
      console.log(JSON.parse(res.data).msg)
      let devList = JSON.parse(res.data).msg.devlist
      let arr = [];
      console.log(that.data.yid)
      for (let i = 0; i < devList.length;i++){
        if(that.data.yid == devList[i].mdid){
          arr.push(devList[i])
        }        
      }
      let kaiguan = [{ weizhi: 1, content: { dname: '' } }, { weizhi: 2, content: { dname: '' } }, { weizhi: 3, content: { dname: '' } }] ;
      for(let i=0;i<arr.length;i++){
        if (arr[i].dcap == "86switch1"){
          kaiguan[0].content.yid = arr[i].yid;
          kaiguan[0].content.dch = arr[i].dch;
          kaiguan[0].content.dname = arr[i].dname;
          kaiguan[0].content.dloca = arr[i].dloca;
          kaiguan[0].content.dpanel = arr[i].dpanel;
          kaiguan[0].content.dlogo = arr[i].dlogo;
          kaiguan[0].content.dcap = arr[i].dcap;          
        } else if (arr[i].dcap == "86switch2") {
          kaiguan[1].content.yid = arr[i].yid;
          kaiguan[1].content.dch = arr[i].dch;
          kaiguan[1].content.dname = arr[i].dname;
          kaiguan[1].content.dloca = arr[i].dloca;
          kaiguan[1].content.dpanel = arr[i].dpanel;
          kaiguan[1].content.dlogo = arr[i].dlogo;
          kaiguan[1].content.dcap = arr[i].dcap;
        } else if (arr[i].dcap == "86switch3") {
          kaiguan[2].content.yid = arr[i].yid;
          kaiguan[2].content.dch = arr[i].dch;
          kaiguan[2].content.dname = arr[i].dname;
          kaiguan[2].content.dloca = arr[i].dloca;
          kaiguan[2].content.dpanel = arr[i].dpanel;
          kaiguan[2].content.dlogo = arr[i].dlogo;
          kaiguan[2].content.dcap = arr[i].dcap;
        }        
      }      
      console.log(kaiguan)
      that.setData({
        kaiguan:kaiguan
      })
    })
  },
  showMenu: function () {
    this.setData({
      menuShow: !this.data.menuShow
    })
  },
  showRoomList: function () {
    this.setData({
      menuShow: !this.data.menuShow,
      hideNum: !this.data.hideNum,
    })
  },
  delEquipment: function () {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '删除该设备，会将该设备绑定所有设备一同删除',
      success: function (res) {
        if (res.confirm) {
          let yidArr = [that.data.yid]
          let kaiguan = that.data.kaiguan;
          for (let i = 0; i < kaiguan.length; i++) {
            yidArr.push(kaiguan[i].content.yid)
          }
          for(let i = 0 ; i<yidArr.length ;i++){
            wx.sendSocketMessage({
              data: JSON.stringify({
                "op": "device",
                "act": "del",
                "uid": that.data.uid,
                "did": that.data.did,
                "date": {
                  "yid": yidArr[i]
                }
              })
            })
            wx.onSocketMessage(function (res) {
              console.log(JSON.parse(res.data));
              wx.navigateBack({})
            })
          }
          
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  room: function (e) {
    console.log(e.detail.value[0])
    this.setData({
      roomObj: this.data.roomList[e.detail.value[0]]
    })
    console.log(this.data)
  },
  confirm: function () {    
    this.showRoomList();
    let roomObj = this.data.roomObj, name, that = this;
    if (roomObj.name == '默认房间') {
      name = "default"
    } else {
      name = roomObj.name
    }
    let yidArr = [that.data.yid]    
    let kaiguan = that.data.kaiguan;
    for(let i = 0; i<kaiguan.length;i++){
      yidArr.push(kaiguan[i].content.yid)      
    }
    console.log(yidArr)
    for (let i = 0; i<yidArr.length;i++) {
      wx.sendSocketMessage({
        data: JSON.stringify({
          "op": "device",
          "act": "update",
          "uid": that.data.uid,
          "did": that.data.did,
          "date": {
            "yid": yidArr[i],
            "dloca": name
          }
        })
      })
      wx.onSocketMessage(function (res) {
        console.log(res)

        if (JSON.parse(res.data).ack == 1) {
          that.setData({
            roomName: that.data.roomObj.name
          })
        }
      })
    }
    
  },
  changType:function(){
    let kaiguan  = this.data.kaiguan;
    this.setData({
      SBtype:'update',      
    })
    this.showMenu();
    wx.setStorage({
      key: 'kaiguan',
      data: kaiguan,
    })
  },
  action:function(e){
    let num = e.currentTarget.dataset.num,that=this;
    this.setData({
      btnName:num
    })
    setTimeout(function(){
      that.setData({
        btnName: ''
      })
    },300)
    if(num==1){
      let key = this.data.btn1
      wx.sendSocketMessage({
        data: JSON.stringify({
          "op": "device",
          "act": "action",
          "uid": that.data.uid,
          "did": that.data.did,
          "date": {
            "fm": "uip",
            "dvcm": '',
            "dkey": key,  
            "yid" : that.data.kaiguan[0].content.yid
          }
        })
      })
      wx.onSocketMessage(function (res) {
        console.log(res)
        that.setData({
          btn1:'86SW_1CLOSE'
        })
      })
    }else if(num==2){
      let key = this.data.btn2;
      wx.sendSocketMessage({
        data: JSON.stringify({
          "op": "device",
          "act": "action",
          "uid": that.data.uid,
          "did": that.data.did,
          "date": {
            "fm": "uip",
            "dvcm": '',
            "dkey": key,
            "yid": that.data.kaiguan[1].content.yid
          }
        })
      })
      wx.onSocketMessage(function (res) {
        console.log(res)
        that.setData({
          btn2: '86SW_2CLOSE'
        })
      })
    }else if(num==3){
      let key = this.data.btn3;
      wx.sendSocketMessage({
        data: JSON.stringify({
          "op": "device",
          "act": "action",
          "uid": that.data.uid,
          "did": that.data.did,
          "date": {
            "fm": "uip",
            "dvcm": '',
            "dkey": key,
            "yid": that.data.kaiguan[2].content.yid
          }
        })
      })
      wx.onSocketMessage(function (res) {
        console.log(res)
        that.setData({
          btn3: '86SW_3CLOSE'
        })
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