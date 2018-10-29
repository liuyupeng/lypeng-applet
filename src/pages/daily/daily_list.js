// pages/daily/daily_list.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        page: 1,
        pages: 1,
        total: 0,
        list: [],
        userid: "",
        date_begin: "",
        date_end: "",
        is_loading: 0,
        is_show_text: 1,
        text_msg: "没有更多数据了"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;

        that.setData({
            userid: options.userid
        }, function(){
            that.doRebind(true);
        });
    },

    bindBeginDateChange: function(event){
        var that = this;

        that.setData({
            date_begin: event.detail.value
        }, function(){
            that.doRebind(true)
        });
    },

    bindEndDateChange: function (event) {
        var that = this;

        that.setData({
            date_end: event.detail.value
        }, function () {
            that.doRebind(true)
        });
    },

    // 初始化加载
    doRebind: function(show_loading){
        var that = this;

        // 初始化分页参数
        that.setData({ page: 1, pages: 1, total: 0 }, function(){
            if (show_loading == true) {
                wx.showLoading({ title: '数据加载中' })
            }
            
            that.doRequest(function (dataList) {
                that.setData({ list: dataList });
            })
        });
    },

    // 加载更多
    doBindPage: function(){
        var that = this

        // 判断是否还有更多数据
        if (that.data.page < that.data.pages) {
            // 当前页+1
            that.setData({ page: that.data.page + 1 })

            that.doRequest(function (dataList) {
                var list = that.data.list

                for (var i in dataList) {
                    list.push(dataList[i])
                }

                that.setData({ list: list })
            })
        }
    },

    // 请求数据
    doRequest: function(cllBack){
        var that = this
        that.setData({is_loading: 1, is_show_text: 0})

        var requestData = app.getRequestData({
            page: that.data.page,
            userid: that.data.userid,
            date_begin: that.data.date_begin,
            date_end: that.data.date_end
        })

        wx.request({
            method: "POST",
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            url: app.getHttpUrl("daily/get_list"),
            data: requestData,
            success: function (result) {
                wx.hideLoading()
                if (result.data.res == 1) {
                    var data = result.data.data
                    
                    that.setData({
                        page: data.page,
                        pages: data.pages,
                        total: data.total,
                        is_loading: 0,
                        is_show_text: 1,
                        text_msg: data.pages > data.page ? "上拉加载更多" : "没有更多数据了"
                    })

                    cllBack(data.items)
                } else {
                    that.setData({
                        is_loading: 0,
                        is_show_text: 1,
                        text_msg: "数据加载失败"
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
        var that = this;
        that.setData({
            date_begin: "",
            date_end: ""
        }, function(){
            that.doRebind(false);
        });

        wx.stopPullDownRefresh();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.doBindPage()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})