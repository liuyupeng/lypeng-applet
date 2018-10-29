// pages/daily/daily_item_list.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        daily_id: "",
        itemInfo: {},
        itemList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;

        that.setData({
            daily_id: options.daily_id || ""
        });

        app.noticeListen("daily_item_change", function(daily_id){
            that.setData({
                daily_id: daily_id
            });
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var that = this;
        that.getItemList(function (itemInfo, itemList) {
            that.setData({
                itemInfo: itemInfo,
                itemList: itemList
            });
        }, true);
    },

    bindAddItem: function () {
        wx.navigateTo({
            url: '../daily/daily_edit?day=' + this.data.itemInfo.day
        })
    },

    getItemList: function (callBack, show_loading) {
        var that = this;
        var requestData = app.getRequestData({
            daily_id: that.data.daily_id
        })

        if (show_loading == true) {
            wx.showLoading({ title: "数据加载中" })
        }
        
        wx.request({
            method: "POST",
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            url: app.getHttpUrl("daily/get_item_list"),
            data: requestData,
            success: function (result) {
                wx.hideToast()
                if (result.statusCode == 200) {
                    var rData = result.data.data
                    callBack(rData.info, rData.items)
                }
            }
        })
    },

    /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
    onPullDownRefresh: function () {
        var that = this;
        that.getItemList(function (itemInfo, itemList) {
            that.setData({
                itemInfo: itemInfo,
                itemList: itemList
            });
        }, false);
        
        wx.stopPullDownRefresh();
    }
})