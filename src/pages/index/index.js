//index.js
// 获取应用实例
var app = getApp()
Page({
    data: {
        userInfo: {},
        page: 1,
        pages: 1,
        total: 0,
        list: [],
        userid: "",
        date_begin: "",
        date_end: "",
        is_loading: 0,
        is_show_text: 1,
        text_msg: "没有更多数据了",
        userIndex: 0,
        userList: ["选择用户"],
        accountList: [],
        is_first: true
    },

    // 设置初始日期为最近一个月
    initDate: function () {
        return false;

        var timestamp = new Date().getTime() / 1000;
        var month_begin = timestamp - 86400 * 30;
        var date_begin = app.formatTime(month_begin, "Y-M-D");
        var date_end = app.formatTime(timestamp, "Y-M-D");

        this.setData({
            date_begin: date_begin,
            date_end: date_end
        });
    },

    onLoad: function () {
        var that = this
        that.initDate();

        // 调用应用实例的方法获取全局数据
        app.getUserInfo(function (userInfo) {
            // 更新数据
            that.setData({
                userInfo: userInfo
            });

            that.doRebind(true);

            that.getUserList(function (accountList) {
                var userIndex = 0;
                var userList = [];
                for (var i in accountList) {
                    userList.push(accountList[i]["username"])
                    if (accountList[i]["userid"] == that.data.userid) {
                        userIndex = i;
                    }
                }

                that.setData({
                    userIndex: userIndex,
                    userList: userList,
                    accountList: accountList
                });
            })
        });

        var that = this;
        app.noticeListen("index_data_reload", function () {
            that.doRebind(false);
        });
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var that = this

        if (that.data.is_first == false) {
            // 调用应用实例的方法获取全局数据
            app.getUserInfo(function (userInfo) {
                // 更新数据
                that.setData({
                    userInfo: userInfo
                })
            })
        } else {
            that.setData({
                is_first: false
            })
        }
    },

    // 开始日期改变事件
    bindBeginDateChange: function (event) {
        this.setData({
            date_begin: event.detail.value
        })

        this.doRebind(true)
    },

    // 结束日期改变事件
    bindEndDateChange: function (event) {
        this.setData({
            date_end: event.detail.value
        })

        this.doRebind(true)
    },

    // 用户选择事件
    bindUserChange: function (event) {
        var userIndex = event.detail.value
        var accountList = this.data.accountList

        this.setData({
            userIndex: userIndex,
            userid: accountList[userIndex]["userid"]
        })

        this.doRebind(true)
    },

    getUserList: function (callBack) {
        var that = this;
        var userList = wx.getStorageSync("account_user_list") || []

        if (userList.length > 0) {
            callBack(userList)
        }

        wx.request({
            method: "POST",
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            url: app.getHttpUrl("index/get_account_list"),
            data: app.getRequestData({ is_default: 1 }),
            success: function (result) {
                if (result.statusCode == 200) {
                    if (result.data.res == 1) {
                        var rData = result.data.data
                        wx.setStorageSync("account_user_list", rData.items)
                        callBack(rData.items)
                    }
                }
            }
        })
    },

    // 初始化加载
    doRebind: function (show_loading) {
        var that = this

        // 初始化分页参数
        that.setData({ page: 1, pages: 1, total: 0 })

        if (show_loading == true) {
            wx.showLoading({ title: '数据加载中' });
        }
        
        that.doRequest(function (dataList) {
            that.setData({ list: dataList });
        })
    },

    // 加载更多
    doBindPage: function () {
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
    doRequest: function (cllBack) {
        var that = this
        that.setData({ is_loading: 1, is_show_text: 0 })

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
                // wx.hideNavigationBarLoading()
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
    * 页面相关事件处理函数--监听用户下拉动作
    */
    onPullDownRefresh: function () {
        var that = this;
        that.initDate();
        that.setData({
            date_begin: "",
            date_end: "",
            userid: "",
            userIndex: 0
        }, function(){
            that.doRebind(false);
        });

        wx.stopPullDownRefresh();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        this.doBindPage();
    }

})
