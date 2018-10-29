// pages/daily/daily_item_info.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        item_id: "",
        itemInfo: {},
        userInfo: {},
        sessionInfo: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this

        that.setData({
            item_id: options.item_id || ""
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var that = this

        app.getUserInfo(function (sessionInfo) {
            // 更新数据
            that.setData({
                sessionInfo: sessionInfo
            })
        })
        

        that.getItemInfo(function (itemInfo) {
            app.noticePublish("daily_item_change", itemInfo["daily_id"]);

            that.setData({
                itemInfo: itemInfo,
                userInfo: itemInfo.userInfo
            })
        })
    },

    getItemInfo: function (callBack) {
        var that = this
        var requestData = app.getRequestData({
            "item_id": that.data.item_id
        })

        wx.request({
            method: "POST",
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            url: app.getHttpUrl("daily/get_item_info"),
            data: requestData,
            success: function (result) {
                if (result.data.res == 1) {
                    callBack(result.data.data)
                } else { // 日报项获取失败
                    wx.showModal({
                        title: "提示",
                        content: "日报项获取失败",
                        showCancel: false
                    })
                }
            }
        });
    },

    // 修改
    bindEdit: function(event){
        wx.setStorageSync("daily_item_info_edit_data", this.data.itemInfo)
        wx.navigateTo({
            url: '../daily/daily_edit?item_id=' + this.data.itemInfo.id
        })
    },

    // 删除
    bindDelete: function(){
        var that = this
        wx.showModal({
            title: '提示',
            content: '删除之后不可恢复，确定要删除吗？',
            success: function(res){
                if (res.confirm == true) {
                    var requestData = app.getRequestData({
                        "item_id": that.data.item_id
                    })

                    wx.request({
                        method: "POST",
                        header: { "Content-Type": "application/x-www-form-urlencoded" },
                        url: app.getHttpUrl("daily/delete_item_info"),
                        data: requestData,
                        success: function (result) {
                            if (result.data.res == 1) {
                                // 删除成功返回上一页
                                wx.navigateBack({
                                    delta: 1
                                })
                            } else { // 删除失败
                                wx.showModal({
                                    title: "提示",
                                    content: result.data.msg,
                                    showCancel: false
                                })
                            }
                        }
                    });
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