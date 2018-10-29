// pages/message/message.js

var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        globalData: {},
        msgList: {
            def: { icons: "warn", title: "操作失败", context: "您在操作时发生一个错误。" },
            limit: { icons: "warn", title: "您被禁止进入此系统", context: "您被禁止进入此系统，如果您需要进入此系统请联系管理员。"},
            nologin: { icons: "warn", title: "用户信息获取失败", context: "抱歉，没有获取到您的信息，请退出后重新进入。" }
        },
        msg_info: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        var msg_type = options["type"]
        if (that["data"]["msgList"][msg_type] == undefined) {
            msg_type = "def";
        }

        this.setData({
            globalData: app.globalData,
            msg_info: that["data"]["msgList"][msg_type]
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