// pages/notice/notice_table.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        _type: "",
        type_text: "",
        list: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this

        var _type = options._type || "department"
        var type_text = _type == "daily_type" ? "工作类别" : "专业组"

        that.setData({
            _type: _type,
            type_text: type_text
        });

        // 动态设置标题
        wx.setNavigationBarTitle({
            title: type_text + "说明"
        })

        if (_type == "daily_type") {
            that.getDailyTypeList(function(list){
                that.setData({
                    list: list
                })
            })
        } else {
            that.getDepartmentList(function (list) {
                that.setData({
                    list: list
                })
            })
        }
    },

    getDepartmentList: function(callBack){
        var that = this;
        var departmentList = wx.getStorageSync("department_list") || []

        if (departmentList.length == 0) {
            wx.showLoading({
                title: "数据加载中"
            })
        } else {
            callBack(departmentList)
        }

        wx.request({
            method: "POST",
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            url: app.getHttpUrl("index/get_department_list"),
            data: app.getRequestData(),
            success: function (result) {
                wx.hideToast()
                if (result.statusCode == 200) {
                    var rData = result.data.data
                    
                    departmentList = rData.items
                    wx.setStorageSync("department_list", departmentList)
                    callBack(departmentList)
                }
            }
        })
    },

    getDailyTypeList: function (callBack){
        var that = this;
        var dailyTypeList = wx.getStorageSync("daily_type_list") || []

        if (dailyTypeList.length == 0) {
            wx.showLoading({
                title: "数据加载中"
            })
        } else {
            callBack(dailyTypeList)
        }

        wx.request({
            method: "POST",
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            url: app.getHttpUrl("daily/get_type_list"),
            data: app.getRequestData(),
            success: function (result) {
                wx.hideToast()
                if (result.statusCode == 200) {
                    var rData = result.data.data

                    dailyTypeList = rData.items
                    wx.setStorageSync("daily_type_list", dailyTypeList)
                    callBack(dailyTypeList)
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