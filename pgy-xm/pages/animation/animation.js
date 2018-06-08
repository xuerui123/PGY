Page({
  data: {
    animationData: {}
  },
  onShow: function () {
   
  },
  aaa:function(){
    this.show()
  },
  show:function(){
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })

    this.animation = animation

    animation.backgroundColor('#3de4ff').step()

    this.setData({
      animationData: animation.export()
    })

    setTimeout(function () {
      animation.backgroundColor('#eee').step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 500)
  },
})