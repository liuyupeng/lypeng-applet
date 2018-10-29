// pages/account/account_info.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userid: "",
        userInfo: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        that.getUserInfo(options.userid, function(userInfo){
            that.setData({
                userid: options.userid,
                userInfo: userInfo
            });
        });
    },

    getUserInfo: function(userid, callBack){
        var that = this
        var data = app.getRequestData({"userid": userid})

        wx.request({
            method: "POST",
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            url: app.getHttpUrl("index/get_user_info"),
            data: data,
            success: function (result) {
                if (result.data.res == 1) {
                    callBack(result.data.data)
                } else { // 用户信息获取失败
                    wx.showModal({
                        title: "提示",
                        content: "用户信息获取失败",
                        showCancel: false
                    })
                }
            }
        });
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