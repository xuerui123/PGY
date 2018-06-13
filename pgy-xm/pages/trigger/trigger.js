// pages/trigger/trigger.js
Page({
  data: {
    temperature: [
      '-19℃', '-18℃', '-17℃', '-16℃', '-15℃', '-14℃', '-13℃', '-12℃', '-11℃', '-10℃', '-9℃', '-8℃', '-7℃', '-6℃', '-5℃', '-4℃', '-3℃', '-2℃', '-1℃', '0℃', '1℃', '2℃', '3℃', '4℃', '5℃', '6℃', '7℃', '8℃', '9℃', '10℃', '11℃', '12℃', '13℃', '14℃', '15℃', '16℃', '17℃', '18℃', '19℃', '20℃', '21℃', '22℃', '23℃', '24℃', '25℃', '26℃', '27℃', '28℃', '29℃', '30℃', '31℃', '32℃', '33℃', '34℃', '35℃', '36℃', '37℃', '38℃', '39℃', '40℃', '41℃', '42℃', '43℃', '44℃', '45℃', '46℃', '47℃', '48℃', '49℃', '50℃', '51℃', '52℃', '53℃', '54℃', '55℃', '56℃', '57℃', '58℃', '59℃'
    ],
    humidity: ['01%', '02%', '03%', '04%', '05%', '06%', '07%', '08%', '09%', '10%', '11%', '12%', '13%', '14%', '15%', '16%', '17%', '18%', '19%', '20%', '21%', '22%', '23%', '24%', '25%', '26%', '27%', '28%', '29%', '30%', '31%', '32%', '33%', '34%', '35%', '36%', '37%', '38%', '39%', '40%', '41%', '42%', '43%', '44%', '45%', '46%', '47%', '48%', '49%', '50%', '51%', '52%', '53%', '54%', '55%', '56%', '57%', '58%', '59%', '60%', '61%', '62%', '63%', '64%', '65%', '66%', '67%', '68%', '69%', '70%', '71%', '72%', '73%', '74%', '75%', '76%', '77%', '78%', '79%', '80%', '81%', '82%', '83%', '84%', '85%', '86%', '87%', '88%', '89%', '90%', '91%', '92%', '93%', '94%', '95%', '96%', '97%', '98%', '99%'],
    evaList: { open: 0, close: 0, move: 0, temH: 0, temL: 0, humH: 0, humL: 0, lumiH: 0, lumiL: 0 },
    man: {
      name: '',
      statusList: ['是', '否'],
      status: '是',
      str: 'top'
    },
    bottomList: [],
    hideSatus: false,
    value: [],
    hideNum: 0,
    promptNnum: 1,
    hidden: true,
    uid: '',
    did: '',
    SBlist: [],
    SBObj: {},
    temH: '33℃',
    temL: '10℃',
    humH: '60%',
    humL: '30%',
    conditionlist:[],
    SBlistStatus: false
  },
  hide: function (e) {
    this.setData({
      hideNum: 0,
      hideSatus: false,
      SBlistStatus: false,
    })
  },
  setStatus: function (e) {
    let obj = e.currentTarget.dataset.obj;
    let arr = [];
    let i = obj.statusList.indexOf(obj.status)
    if (obj.statusList.length == 0) {
      return
    } else {
      arr.push(i)
      this.setData({
        value: arr,
        bottomList: obj,
        hideSatus: true,
        hideNum: 1
      })
    }
  },
  chosetemperature: function (e) {
    let obj = {
      statusList: e.currentTarget.dataset.obj,
      str: e.currentTarget.dataset.str
    }, i = [];
    if (obj.str == 'temH') {
      i.push(parseInt(this.data.temH) + 19)
    } else if (obj.str == 'temL') {
      i.push(parseInt(this.data.temL) + 19)
    } else if (obj.str == 'humH') {
      i.push(parseInt(this.data.humH) - 1)
    } else if (obj.str == 'humL') {
      i.push(parseInt(this.data.humL) - 1)
    }

    this.setData({
      bottomList: obj,
      hideSatus: true,
      hideNum: 1,
      value: i
    })
  },
  confirm: function (e) {
    console.log(e)
    console.log(e.detail.value)
    let obj = this.data.bottomList;
    let that = this
    //判断点击位置top为顶部，list为事件
    if (obj.str == 'top') {
      let man = this.data.man;
      man.status = man.statusList[e.detail.value[0]]
      this.setData({
        man: man
      })
    } else if (obj.str == 'temH') {
      this.setData({
        temH: that.data.temperature[e.detail.value[0]]
      })
    } else if (obj.str == 'temL') {
      this.setData({
        temL: that.data.temperature[e.detail.value[0]]
      })
    } else if (obj.str == 'humH') {
      this.setData({
        humH: that.data.humidity[e.detail.value[0]]
      })
    } else if (obj.str == 'humL') {
      this.setData({
        humL: that.data.humidity[e.detail.value[0]]
      })
    }

  },
  addCondition: function (e) {
    console.log(e.currentTarget.dataset)
    let that = this;
    let conditionlist = this.data.conditionlist;    
    let SBObj = this.data.SBObj;
    console.log(SBObj)
    let str = e.currentTarget.dataset.str;    
    let num = e.currentTarget.dataset.num;    
    let loca = SBObj.dloca == 'default' ? '默认房间' : SBObj.dloca ;
    let obj = {
      loca: loca,
      name:SBObj.dname,
      yid:SBObj.yid,
      str:str,
      num:num
      
    }    
    if(conditionlist.length==0){
      conditionlist.push(obj)
    }else{            
      let index = 0;
      for (let i = 0; i < conditionlist.length; i++) {
        if (conditionlist[i].yid == obj.yid && conditionlist[i].str == obj.str) {
          console.log('重复')          
          index = i+1          
        }
      }
      console.log(index)
      if(!index){
        conditionlist.push(obj)
        console.log('push')
      }else{
        console.log(conditionlist[index-1])
        wx.showModal({
          title: '提示',
          content: '该事件已添加，是否替换之前事件',
          success:function(res){
            if(res.confirm){
              conditionlist[index - 1] = obj
              that.setData({
                conditionlist: conditionlist
              })
            }
          }
        })        
      }
    }            
    this.setData({
      conditionlist: conditionlist
    })
    
  },
  
  del:function(e){    
    let that =this;
    wx.showModal({
      title: '提示',
      content: '确认删除该事件',
      success:function(res){
        if (res.confirm){
          let arr = that.data.conditionlist;
          arr.splice(e.currentTarget.dataset.i, 1)
          that.setData({
            conditionlist: arr
          })
        }
      }
    })
    
  },

  showHelp: function () {
    if (this.data.hidden) {
      this.setData({
        hidden: false
      })
    } else {
      this.setData({
        hidden: true
      })
    }
  },
  preserve: function () {        
    let list = this.data.conditionlist;  
    let man = this.data.man;
    let sevc = ''
    if(man.status=='是'){
      sevc = 1
    }else{
      sevc = 0 
    }
    wx.getStorage({
      key: 'sence',
      success: function(res) {
        let sence = res.data;
        sence.sev = list;
        sence.sevc =sevc;
        wx.setStorage({
          key: 'sence',
          data: sence,
        })
        wx.navigateBack({})     
      },
      fail:function(){
        let sence = {};
        sence.sev = list
        sence.sevc = sevc;
        wx.setStorage({
          key: 'sence',
          data: sence,
        })     
        wx.navigateBack({})
      }
    })
             
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
        that.loadshebei();
      }
    });
    wx.getStorage({
      key: 'sence',
      success: function(res) {
        let arr = res.data.sev
        if(!arr){
          arr =[]
        }
        that.setData({
          conditionlist: arr
        })
      },
    })
  },
  loadshebei: function () {
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
      let list = JSON.parse(res.data).msg.devlist, arr = [];
      for (let i = 0; i < list.length; i++) {
        if (list[i].eva != '') {
          arr.push(list[i])
        }
      }
      console.log(arr)
      let evaList = that.data.evaList;
      let SBeva = arr[0].eva.split(',');
      for (let i = 0; i < SBeva.length; i++) {
        evaList[SBeva[i]] = 1
      }
      that.setData({
        SBlist: arr,
        SBObj: arr[0],
        evaList: evaList
      })
    })
  },
  chooseSB: function () {
    this.setData({
      hideSatus: true,
      SBlistStatus: true,
    })
  },
  chooseSBobj: function (e) {
    let evaList = this.data.evaList;
    for (let item in evaList) {
      evaList[item] = 0
    }
    let SBeva = e.currentTarget.dataset.obj.eva.split(',');
    for (let i = 0; i < SBeva.length; i++) {
      evaList[SBeva[i]] = 1
    }
    this.setData({
      hideSatus: false,
      SBlistStatus: false,
      evaList: evaList,
      SBObj: e.currentTarget.dataset.obj
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})