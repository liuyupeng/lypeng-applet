// pages/account/account_auth.js

var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: "",
        departmentList: [],
        departments: [],
        dIndex: 0,
        department_id : "",
        button_disabled: 0,
        showTopTips: 0,
        errorTips: "",
        froms: "index"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.setData({
            froms: options.froms || "index",
            userInfo: app.userInfo,
            department_id: app.userInfo.department_id
        })

        this.getDepartments()
    },

    // 显示错误提示
    setErrorTips: function (errorTips) {
        var that = this
        that.setData({ showTopTips: 1, errorTips: errorTips })

        setTimeout(function () {
            that.setData({ showTopTips: 0, errorTips: "" })
        }, 3000);
    },

    // 专业组改变事件
    departmentChange: function(event){
        var dIndex = event.detail.value
        var departmentList = this.data.departmentList

        this.setData({
            dIndex: dIndex,
            department_id: departmentList[dIndex]["id"]
        })
    },

    // 获取专业组
    getDepartments: function(){
        var that = this;

        wx.request({
            method: "POST",
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            url: app.getHttpUrl("index/get_department_list"),
            data: app.getRequestData(),
            success: function (result) {
                if (result.statusCode == 200) {
                    var rData = result.data.data
                    var departmentList = rData.items

                    var dIndex = 0;
                    var departments = [];
                    for (var i in departmentList) {
                        departments.push(departmentList[i]["name"])
                        if (departmentList[i]["id"] == that.data.department_id) {
                            dIndex = i;
                        }
                    }

                    that.setData({
                        dIndex: dIndex,
                        departments: departments,
                        departmentList: departmentList,
                        department_id: departmentList[dIndex]["id"]
                    })
                }
            }
        })
    },
    

    // 表单提交
    doFormSubmit: function(event){
        var that= this;
        var formData = event.detail.value
        var queryData = app.getRequestData(formData);
        queryData["department_id"] = this.data.department_id;

        var errorTips = "";
        if (queryData["username"] == "") {
            errorTips = "请先输入姓名"
        } else if (queryData["mobile"] == "") {
            errorTips = "请先输入手机号"
        }

        if (errorTips != "") {
            that.setErrorTips(errorTips)
            return false
        }

        that.setData({ button_disabled: 1})

        wx.request({
            method: "POST",
            header: { "Content-Type": "application/x-www-form-urlencoded" },
            url: app.getHttpUrl("index/edit_auth_info"),
            data: queryData,
            success: function (result) {
                if (result.statusCode == 200) {
                    if (result.data.res == 1) {
                        var userInfo = result.data.data
                        app.setUserInfo(userInfo)

                        if (that.data.froms == "personal") {
                            wx.navigateBack({
                                delta: 1
                            })
                        } else {
                            wx.switchTab({
                                url: '../index/index'
                            })
                        }
                    } else {
                        that.setData({ button_disabled: 0 })
                        that.setErrorTips(result.data.msg)
                    }
                }
            }
        })
    }
})