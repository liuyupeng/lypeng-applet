//app.js
App({
    _listen_fns: {},
    http_url: "https://daily.pumintech.com/",
    userInfo: null,
    onLaunch: function () {
        // 调用API从本地缓存中获取数据
        this.userInfo = wx.getStorageSync("daily_user_info")
    },
    getHttpUrl: function (action) {
        return this.http_url + action
    },
    getRequestData: function (formData) {
        formData = formData || {}
        var signature = this.userInfo ? this.userInfo.access_token : "";
        formData["signature"] = signature

        return formData
    },
    setUserInfo: function (userInfo) {
        // 用户信息保存同步保存到本地缓存
        this.userInfo = userInfo
        wx.setStorageSync("daily_user_info", userInfo)
    },
    removeUserInfo: function (userInfo) {
        // 用户信息清除同步清除本地缓存
        this.userInfo = null
        wx.removeStorageSync("daily_user_info")
    },
    checkUserInfo: function(userInfo){
        var that = this
        if (userInfo && userInfo.wx_openid) {
            if (userInfo.is_limit == 1) {
                wx.redirectTo({ // 用户被禁止进入系统
                    url: "../message/message?type=limit"
                })

                return false
            } else if (userInfo.is_auth == 0) {
                wx.redirectTo({ // 用户还没有进行认证
                    url: "../account/account_auth"
                })

                return false
            }

            return true
        }

        return false
    },
    getUserInfo: function (callBack) {
        var that = this
        if (that.userInfo && that.userInfo.wx_openid) {
            wx.checkSession({
                success: function () {
                    //session 未过期，并且在本生命周期一直有效
                    if (that.checkUserInfo(that.userInfo)) {
                        typeof callBack == "function" && callBack(that.userInfo)
                        
                        // return true;
                        
                        wx.request({
                            method: "POST",
                            header: { "Content-Type": "application/x-www-form-urlencoded" },
                            url: that.getHttpUrl("index/get_account_info"),
                            data: { signature: that.userInfo.access_token },
                            success: function (result) {
                                if (result.data.res == 1) {
                                    that.setUserInfo(result.data.data) // 保存用户信息
                                } else { // 用户信息获取失败
                                    that.removeUserInfo() // 清空用户信息
                                }
                            }
                        });
                    }
                },
                fail: function () {
                    //登录态过期
                    that.doLogin(callBack)
                }
            })
        } else {
            // 调用登录接口
            that.doLogin(callBack)
        }
    },
    doLogin: function (callBack) {
        var that = this
        wx.login({
            success: function (res) {
                wx.getUserInfo({
                    success: function (result) {
                        wx.request({
                            method: "POST",
                            header: { "Content-Type": "application/x-www-form-urlencoded" },
                            url: that.getHttpUrl("index/do_login"),
                            data: {
                                signature: "C586F971CEE0C69DB3875B947EFCD184",
                                wx_code: res.code,
                                wx_rawdata: result.rawData,
                                wx_iv: result.iv
                            },
                            success: function (result) {
                                if (result.data.res == 1) {
                                    that.setUserInfo(result.data.data) // 保存用户信息
                                    that.getUserInfo(callBack)
                                } else { // 用户信息获取失败
                                    wx.redirectTo({ // 跳转到信息提示页
                                        url: "../message/message?type=nologin"
                                    })
                                }
                            }
                        });
                    },
                    fail: function(e){
                        that.noticeListen("login_auth_callback", callBack);

                        wx.navigateTo({
                            url: "../auth/auth"
                        });
                    }
                })
            }
        })
    },
    globalData: {
        foot_text: "上海浦敏科技发展股份有限公司",
        copyright: "2018 pumintech.com"
    },
    formatNumber: function(n) {
        n = n.toString()
        return n[1] ? n : '0' + n
    },
    formatTime: function (numbers, format) {
        numbers = numbers || 0
        format = format || "Y-M-D h:m:s"

        var returnArr = [];
        var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];

        if (numbers == 0) {
            var date = new Date();
        } else {
            var date = new Date(numbers * 1000);
        }

        returnArr.push(date.getFullYear());
        returnArr.push(this.formatNumber(date.getMonth() + 1));
        returnArr.push(this.formatNumber(date.getDate()));

        returnArr.push(this.formatNumber(date.getHours()));
        returnArr.push(this.formatNumber(date.getMinutes()));
        returnArr.push(this.formatNumber(date.getSeconds()));

        for (var i in returnArr) {
            format = format.replace(formateArr[i], returnArr[i]);
        }

        return format;  
    },
    // 广播事件监听
    noticeListen: function (key, callback) {
        this._listen_fns[key] = this._listen_fns[key] ? this._listen_fns[key] : [];
        this._listen_fns[key].push(callback);
    },

    // 广播事件发布
    noticePublish: function (key, data) {
        var _listen_fns = this._listen_fns;
        if (_listen_fns[key]) {
            for (var i in _listen_fns[key]) {
                if (typeof _listen_fns[key][i] == "function") {
                    try {
                        _listen_fns[key][i](data);
                    } catch (e) {
                        console.log("publish error");
                    }
                }
            }
        }
    }
})