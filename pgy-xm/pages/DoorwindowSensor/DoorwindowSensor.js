// pages/MCCGQ/MCCGQ.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuShow: true,
    hideNum: false,
    uid: '',
    did: '',
    yid:'',
    roomName: '默认房间',
    roomList: [],
    value: 0,
    roomObj: {},
    equipmentObj:'',
    size:1,
    devlogarr:[],
    devlogList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getStorage({
      key: 'equipmentObj',
      success: function (res) {
        let roomObj = { name: res.data.dloca }
        that.setData({
          yid: res.data.yid,
          roomObj: roomObj,
          equipmentObj: res.data,          
        })
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
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          uid: res.data,
        })
      }
    });
    wx.getStorage({
      key: 'did',
      success: function (res) {
        that.setData({
          did: res.data,
        })
        that.loadList()
      }
    });
    wx.getStorage({
      key: 'roomList',
      success: function (res) {        
        that.setData({
          roomList: res.data,
        })
      }
    });
  },
  loadList:function(){
    let that = this;
    wx.sendSocketMessage({
      data: JSON.stringify({
        "op": "devlog",
        "act": "list",
        "uid": that.data.uid,
        "did": that.data.did,
        "date": {
          "yid": that.data.yid,
          'page':that.data.size,
          'dname': that.data.equipmentObj.dname
        }
      })
    })
    wx.onSocketMessage(function (res) {            
      let devlogList = that.data.devlogList.concat(JSON.parse(res.data).msg) 
      that.setData({ devlogList: devlogList})
      let year = new Date().getFullYear();
      let month = (parseInt(new Date().getMonth() + 1)) < 10 ? '0' + parseInt(new Date().getMonth() + 1) : parseInt(new Date().getMonth() + 1) 
      let day =new Date().getDate() < 10 ?'0'+ new Date().getDate() : new Date().getDate()      
      let date = year + '-' + month + '-' + day;       
      for (let i = 0; i < devlogList.length; i++) {        
        devlogList[i].date = devlogList[i].time.split(';')[0];
        devlogList[i].timer = devlogList[i].time.split(';')[1];        
      }
      const mapLoction = function (arr) {
        let newArr = [];
        arr.forEach((address, i) => {
          let index = -1;
          let alreadyExists = newArr.some((newAddress, j) => {
            if (address.date === newAddress.date) {
              index = j;
              return true;
            }
          });
          if (!alreadyExists) {
            newArr.push({
              date: address.date,
              arr: [address]
            });
          } else {
            newArr[index].arr.push(address);
          }
        });
        return newArr;
      };
      let devlogarr = mapLoction(devlogList) 
      for (let i = 0; i < devlogarr.length ;i++){
        if (devlogarr[i].date == date){
          devlogarr[i].title = '今天'
          devlogarr[0].arr[0].active=1;
        } else if (devlogarr[i].date.split('-')[0] == year && devlogarr[i].date.split('-')[1] == month && parseInt(devlogarr[i].date.split('-')[2])+1 == day ){
          devlogarr[i].title = '昨天'
        } else{
          devlogarr[i].title = devlogarr[i].date.split('-')[1] + '月' + devlogarr[i].date.split('-')[2]+'日'
        }
      }
      that.setData({
        devlogarr: devlogarr
      })
      console.log(devlogarr)
    })
  },

  delRecord: function () {
    wx.showModal({
      title: '提示',
      content: '删除历史记录',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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
      content: '删除这个设备',
      success: function (res) {
        if (res.confirm) {
          wx.sendSocketMessage({
            data: JSON.stringify({
              "op": "device",
              "act": "del",
              "uid": that.data.uid,
              "did": that.data.did,
              "date": {
                "yid": that.data.yid
              }
            })
          })
          wx.onSocketMessage(function (res) {
            console.log(JSON.parse(res.data));
            wx.navigateBack({})
            wx.showToast({
              title: '删除成功',
            })

          })
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
    let roomObj = this.data.roomObj, name, that = this;
    if (roomObj.name == '默认房间') {
      name = "default"
    } else {
      name = roomObj.name
    }
    wx.sendSocketMessage({
      data: JSON.stringify({
        "op": "device",
        "act": "update",
        "uid": that.data.uid,
        "did": that.data.did,
        "date": {
          "yid": that.data.yid,
          "dloca": name
        }
      })
    })
    wx.onSocketMessage(function (res) {
      console.log(res)
      if (JSON.parse(res.data).ack == 1) {
        that.setData({
          hideNum: 0,
          roomName: that.data.roomObj.name
        })
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
    let size = this.data.size
    size++
    this.setData({
      size:size
    })
    this.loadList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})