// pages/account/account_list.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        this.getUserList(function(userList){
            that.setData({
                userList: userList
            });
        });
    },

    getUserList: function(callBack, refresh){
        var that = this;
        var userList = wx.getStorageSync("account_user_list") || []

        if (userList.length == 0 || refresh == true) {
            wx.showLoading({
                title: "数据加载中"
            })
        } else {
            callBack(userList)
        }

        wx.request({
            method: "POST",
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            url: app.getHttpUrl("index/get_account_list"),
            data: app.getRequestData(),
            success: function (result) {
                wx.hideToast()
                if (result.statusCode == 200) {
                    var rData = result.data.data

                    userList = rData.items
                    wx.setStorageSync("account_user_list", userList)
                    callBack(userList)
                }
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
        var that = this;
        this.getUserList(function (userList) {
            that.setData({
                userList: userList
            });
        }, false);

        wx.stopPullDownRefresh();
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