// pages/log/bridge/bridge_edit.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        ins_date_begin: "",
        ins_date_end: "",
        material: "",
        lay_type: "",
        project_id: "",
        projectIndex: 0,
        projectList: [],
        projectNameList: [],
        materialList: [],
        materialIndex: 0,
        layTypeList: [],
        layTypeIndex: 0,
        btn_disabled: 0,
        topTipText: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        app.getUserInfo(function (userInfo){
            var today = app.formatTime(0, "Y-M-D");
            
            that.setData({
                userInfo: userInfo,
                ins_date_begin: today,
                ins_date_end: today
            }, function(){
                that.getDataMap(function (items) {
                    var projectList = items["projectList"];
                    var layTypeList = items["lay_type"]["items"];
                    var materialList = items["material"]["items"];
                    
                    // 敷设方式处理
                    var layTypeIndex = 0;
                    for (var i in layTypeList) {
                        if (layTypeList[i] == that["data"]["lay_type"]) {
                            layTypeIndex = i;
                        }
                    }

                    // 材料处理
                    var materialIndex = 0;
                    for (var i in materialList) {
                        if (materialList[i] == that["data"]["material"]) {
                            materialIndex = i;
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
                        layTypeList: layTypeList,
                        layTypeIndex: layTypeIndex,
                        lay_type: layTypeList[layTypeIndex],

                        materialList: materialList,
                        materialIndex: materialIndex,
                        material: materialList[materialIndex],

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
    getDataMap: function(callback){
        var that = this;
        var data = {group: "bridge"};

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

    // 安装开始日期改变事件
    bindDateBeginChange: function (event) {
        this.setData({
            ins_date_begin: event.detail.value
        });
    },

    // 安装结束日期改变事件
    bindDateEndChange: function (event) {
        this.setData({
            ins_date_end: event.detail.value
        });
    },

    // 材料改变事件
    bindMaterialChange: function (event){
        var materialIndex = event.detail.value;
        var materialList = this["data"]["materialList"];

        this.setData({
            materialIndex: materialIndex,
            material: materialList[materialIndex]
        });
    },

    // 敷设方式改变事件
    bindLayTypeChange: function (event) {
        var layTypeIndex = event.detail.value;
        var layTypeList = this["data"]["layTypeList"];

        this.setData({
            layTypeIndex: layTypeIndex,
            lay_type: layTypeList[layTypeIndex]
        });
    },

    // 项目改变事件
    bindProjectChange: function (event){
        var projectIndex = event.detail.value;
        var projectList = this["data"]["projectList"];

        this.setData({
            projectIndex: projectIndex,
            project_id: projectList[projectIndex]["id"]
        });
    },

    // 提交表单
    bindFormSubmit: function (event){
        var that = this;
        var formData = event.detail.value;
        formData["material"] = that["data"]["material"];
        formData["lay_type"] = that["data"]["lay_type"];
        formData["project_id"] = that["data"]["project_id"];

        that.setData({btn_disabled: 1});

        wx.request({
            method: "POST",
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            url: app.getHttpUrl("log/edit_bridge_data"),
            data: app.getRequestData(formData),
            success: function (result) {
                if (result.data.res == 1) {
                    wx.showModal({
                        title: "提示",
                        content: "记录保存成功，是否继续添加",
                        success: function (res) {
                            if (res.confirm) {
                                wx.redirectTo({
                                    url: "bridge_edit"
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