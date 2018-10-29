// pages/daily/daily_edit.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        day: "",
        item_id: "",
        itemInfo: [],
        dIndex: 0,
        dailytypes: [],
        dailyTypeList: [],
        daily_type_id: "",
        button_disabled: 0,
        textareas: {
            context: "",
            question: "",
            remarks: ""
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        if (options.item_id) {
            var itemInfo = wx.getStorageSync("daily_item_info_edit_data")
            that.setData({
                day: itemInfo.day,
                item_id: itemInfo.id,
                itemInfo: itemInfo,
                daily_type_id: itemInfo.daily_type_id,
                textareas: {
                    context: itemInfo.context,
                    question: itemInfo.question,
                    remarks: itemInfo.remarks
                }
            })
        } else {
            var today = app.formatTime(0, "Y-M-D")
            that.setData({
                day: options.day || today,
            })
        }

        that.getDailyTypeList(function (dailyTypeList){
            var dIndex = 0;
            var dailytypes = [];
            for (var i in dailyTypeList) {
                dailytypes.push(dailyTypeList[i]["name"])
                if (dailyTypeList[i]["id"] == that.data.daily_type_id) {
                    dIndex = i;
                }
            }

            that.setData({
                dIndex: dIndex,
                dailytypes: dailytypes,
                dailyTypeList: dailyTypeList,
                daily_type_id: dailyTypeList[dIndex]["id"]
            })
        })
    },

    bindInputBlur: function (event) {
        var terxtareas = this.data.textareas
        this.setData({
            textareas: terxtareas
        })
    },

    bindTextChange: function (event){
        var targetId = event.target.id
        var terxtareas = this.data.textareas
        terxtareas[targetId] = event.detail.value

        this.setData({
            textareas: terxtareas
        })
    },

    bindDayChange: function(event){
        this.setData({
            day: event.detail.value
        })
    },

    bindDailyTypeChange: function(event){
        var dIndex = event.detail.value
        var dailyTypeList = this.data.dailyTypeList

        this.setData({
            dIndex: dIndex,
            daily_type_id: dailyTypeList[dIndex]["id"]
        })
    },

    getDailyTypeList: function (callBack){
        var that = this;
        var dailyTypeList = wx.getStorageSync("daily_type_list") || []

        if (dailyTypeList.length > 0) {
            callBack(dailyTypeList)
        }

        wx.request({
            method: "POST",
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            url: app.getHttpUrl("daily/get_type_list"),
            data: app.getRequestData(),
            success: function (result) {
                if (result.statusCode == 200) {
                    if (result.data.res == 1) {
                        var rData = result.data.data
                        wx.setStorageSync("daily_type_list", rData.items)
                        callBack(rData.items)
                    }
                }
            }
        })
    },

    doFormSubmit: function(event){
        var that = this;
        var formData = event.detail.value
        var requestData = app.getRequestData(formData);
        requestData["day"] = this.data.day;
        requestData["item_id"] = this.data.item_id;
        requestData["daily_type_id"] = this.data.daily_type_id;

        that.setData({
            button_disabled : 1
        })

        wx.request({
            method: "POST",
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            url: app.getHttpUrl("daily/edit_item_info"),
            data: requestData,
            success: function (result) {
                if (result.statusCode == 200) {
                    if (result.data.res == 1) {
                        // 首页数据重新加载
                        app.noticePublish("index_data_reload");

                        // 返回上一页
                        wx.navigateBack({
                            delta: 1
                        });
                    } else {
                        // 提交按钮可用
                        that.setData({
                            button_disabled: 0
                        });

                        // 错误提示
                        wx.showModal({
                            title: '提示',
                            content: result.data.msg,
                            showCancel: false
                        })
                    }
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