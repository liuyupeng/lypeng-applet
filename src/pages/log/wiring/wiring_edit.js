// pages/log/wiring/wiring_edit.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        lay_date: "",
        test_date: "",
        cable_use: "",
        lay_state: "",
        test_state: "",
        project_id: "",
        projectIndex: 0,
        projectList: [],
        projectNameList: [],
        cableIndex: 0,
        cableUseList: [],
        layIndex: 0,
        layStateList: [],
        testIndex: 0,
        testStateList: [],
        btn_disabled: 0,
        topTipText: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        app.getUserInfo(function (userInfo) {
            var today = app.formatTime(0, "Y-M-D");

            that.setData({
                userInfo: userInfo,
                lay_date: today
            }, function () {
                that.getDataMap(function (items) {
                    var projectList = items["projectList"];
                    var cableUseList = items["cable_use"]["items"];
                    var layStateList = items["lay_state"]["items"];
                    var testStateList = items["test_state"]["items"];


                    // 线缆用途处理
                    var cableIndex = 0;
                    for (var i in cableUseList) {
                        if (cableUseList[i] == that["data"]["cable_use"]) {
                            cableIndex = i;
                        }
                    }

                    // 敷设状况处理
                    var layIndex = 0;
                    for (var i in layStateList) {
                        if (layStateList[i] == that["data"]["lay_state"]) {
                            layIndex = i;
                        }
                    }

                    // 测试状况处理
                    var testIndex = 0;
                    for (var i in testStateList) {
                        if (testStateList[i] == that["data"]["test_state"]) {
                            testIndex = i;
                        }
                    }

                    // 项目处理
                    var projectIndex = 0;
                    var projectNameList = [];
                    for (var i in projectList) {
                        projectNameList.push(projectList[i]["name"]);
                        if (projectList[i]["id"] == that["data"]["project_id"]) {
                            projectIndex = i;
                        }
                    }

                    that.setData({
                        layIndex: layIndex,
                        layStateList: layStateList,
                        lay_state: layStateList[layIndex],

                        testIndex: testIndex,
                        testStateList: testStateList,
                        test_state: testStateList[testIndex],

                        cableIndex: cableIndex,
                        cableUseList: cableUseList,
                        cable_use: cableUseList[cableIndex],

                        projectList: projectList,
                        projectIndex: projectIndex,
                        projectNameList: projectNameList,
                        project_id: projectList[projectIndex]["id"]
                    });
                });
            });
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

    },

    // 获取页面数据
    getDataMap: function (callback) {
        var that = this;
        var data = { group: "wiring" };

        wx.request({
            method: "POST",
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            url: app.getHttpUrl("log/get_map_data"),
            data: app.getRequestData(data),
            success: function (result) {
                if (result.data.res == 1) {
                    callback(result.data.data);
                }
            }
        });
    },

    // 敷设日期改变事件
    bindLayDateChange: function (event) {
        this.setData({
            lay_date: event.detail.value
        });
    },

    // 敷设日期改变事件
    bindTestDateChange: function (event) {
        this.setData({
            test_date: event.detail.value
        });
    },

    // 线缆用途改变事件
    bindCableUseChange: function (event) {
        var cableIndex = event.detail.value;
        var cableUseList = this["data"]["cableUseList"];

        this.setData({
            cableIndex: cableIndex,
            cable_use: cableUseList[cableIndex]
        });
    },

    // 敷线状况改变事件
    bindLayStateChange: function (event) {
        var layIndex = event.detail.value;
        var layStateList = this["data"]["layStateList"];

        this.setData({
            layIndex: layIndex,
            lay_state: layStateList[layIndex]
        });
    },

    // 测试状况改变事件
    bindTestStateChange: function (event) {
        var testIndex = event.detail.value;
        var testStateList = this["data"]["testStateList"];

        this.setData({
            testIndex: testIndex,
            test_state: testStateList[testIndex]
        });
    },

    // 项目改变事件
    bindProjectChange: function (event) {
        var projectIndex = event.detail.value;
        var projectList = this["data"]["projectList"];

        this.setData({
            projectIndex: projectIndex,
            project_id: projectList[projectIndex]["id"]
        });
    },

    // 提交表单
    bindFormSubmit: function (event) {
        var that = this;
        var formData = event.detail.value;
        formData["cable_use"] = that["data"]["cable_use"];
        formData["lay_state"] = that["data"]["lay_state"];
        formData["test_state"] = that["data"]["test_state"];
        formData["project_id"] = that["data"]["project_id"];

        that.setData({ btn_disabled: 1 });

        wx.request({
            method: "POST",
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            url: app.getHttpUrl("log/edit_wiring_data"),
            data: app.getRequestData(formData),
            success: function (result) {
                if (result.data.res == 1) {
                    wx.showModal({
                        title: "提示",
                        content: "记录保存成功，是否继续添加",
                        success: function (res) {
                            if (res.confirm) {
                                wx.redirectTo({
                                    url: "wiring_edit"
                                });
                            } else if (res.cancel) {
                                wx.navigateBack({
                                    delta: 1
                                });
                            }
                        }
                    });

                } else {
                    that.setData({
                        btn_disabled: 0,
                        topTipText: result.data.msg
                    });

                    setTimeout(function () {
                        that.setData({
                            topTipText: ""
                        });
                    }, 3000);
                }
            }
        });
    }
})