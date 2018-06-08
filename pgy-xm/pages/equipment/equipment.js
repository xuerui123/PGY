// pages/equipment/equipment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultList: [],
    showStatus: '',
    roomStatus: '',
    categoryStatus: '',
    roomName: '所有房间',
    categoryName: '所有类别',
    roomList: [],
    roomCategoryList: [],
    uid:'',
    did:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  goPage: function (e) {
    console.log(e)
    let str = e.currentTarget.dataset.str;
    let obj = e.currentTarget.dataset.obj;
    wx.setStorage({
      key: 'equipmentObj',
      data: obj,
    })
    wx.navigateTo({
      url: '../' + str + '/' + str
    });
  },
  loadroom: function () {
    let that = this;
    wx.sendSocketMessage(
      {
        data: JSON.stringify({
          "op": "room",
          "act": "list",
          "uid": that.data.uid,
          "did": that.data.did,
        })
    })
    wx.onSocketMessage(function (res) {
      console.log(JSON.parse(res.data));
      that.setData({
        roomList: JSON.parse(res.data).msg
      })
      wx.setStorage({
        key: "roomList",
        data: JSON.parse(res.data).msg
      })
      that.loadshebei();
    })
  },
  loadshebei: function () {
    let that = this;
    wx.sendSocketMessage(
      {
        data: JSON.stringify({ 
          "op":"device",
          "act":"list",
          "uid": that.data.uid,
          "did": that.data.did ,
          "date":{}
          })
      })
    wx.onSocketMessage(function (res) {
      let list = JSON.parse(res.data).msg.devlist;
      let roomList = that.data.roomList;     
      console.log(list) 
      console.log(roomList)
      let roomCategoryList =[];
      for(let i = 0; i< list.length ; i++){
        if(list[i].dname.indexOf('语音')!=-1){
          let obj = list[i];
          list.splice(i,1)
          list.unshift(obj);          
        }
      }
      for (let i = 0; i < roomList.length; i++) {
        var temObj = {};

        temObj.name = roomList[i].name;
        temObj.status= 1;
        var temList = [];

        for (let j = 0; j < list.length; j++) {
          if (temObj.name == list[j].dloca) {
            temList.push(list[j]);
          }
        }
        temObj.content = temList;

        roomCategoryList.push(temObj);
      }   
      let obj = {
        name:'默认房间',
        status:1,
        content:[]          
      }   
      for(let i = 0 ; i<list.length;i++){
        if (list[i].dloca =="default"){
          console.log('item', list[i])
          obj.content.push(list[i])
        }
      }
      roomCategoryList.unshift(obj)
      console.log(111,roomCategoryList)
      that.setData({
        roomCategoryList: roomCategoryList,        
      })

    })
  },
  hide: function () {
    this.setData({
      roomStatus: 0,
      categoryStatus: 0,
      showStatus: 0,
    })
  },
  showRoomList: function () {
    if (this.data.roomStatus) {
      this.setData({
        roomStatus: 0,
        showStatus: 0
      })
    } else {
      this.setData({
        roomStatus: 1,
        showStatus: 1
      })
    }
  },
  showCategoryList: function () {
    if (this.data.categoryStatus) {
      this.setData({
        categoryStatus: 0,
        showStatus: 0
      })
    } else {
      this.setData({
        categoryStatus: 1,
        showStatus: 1
      })
    }
  },
  choseRoom: function (e) {
    console.log(e)
    let str = e.currentTarget.dataset.str, roomCategoryList = this.data.roomCategoryList;
    console.log(str, roomCategoryList)
    if (str == '所有房间') {
      for (let i = 0; i < roomCategoryList.length; i++) {
        roomCategoryList[i].status = 1
      }
    } else {
      for (let i = 0; i < roomCategoryList.length; i++) {
        roomCategoryList[i].status = 2
        if (roomCategoryList[i].name == str) {
          roomCategoryList[i].status = 1
        }
      }
    }
    console.log(roomCategoryList)
    this.setData({
      roomName: str,
      roomStatus: 0,
      showStatus: 0,
      roomCategoryList: roomCategoryList
    })
  },
  choseCategory: function (e) {
    let str = e.currentTarget.dataset.str;
    console.log(str)
    if (str == 'list1') {
      this.setData({
        categoryStatus: str,
      })
    } else if (str == 'list2') {
      this.setData({
        categoryStatus: str,
      })
    } else {
      this.setData({
        categoryName: str,
        categoryStatus: 0,
        showStatus: 0
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
    // this.setData({
    //   roomCategoryList: []
    // })
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
        that.loadroom();   
      }      
    });          
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