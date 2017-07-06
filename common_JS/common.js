/*! common - v0.0.2 - 2016年9月18日16:44:56
 * http://www.tomxiang.com
 * Copyright (c) 2016 Diogoxiang ; */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory)
    } else if (typeof exports === 'object') {
        module.exports = factory()
    } else {
        root.c = factory()
    }
})(this, function() {
    'use strict'

    // Baseline
    /* -------------------------------------------------------------------------- */
    /**
     * getXX 用于获取数据
     * doXX  用于实现某些方法
     */
    var c = {
        // 当前版本号
        ver: '0.0.2',
        /**
         * init 初始化
         **/
        init: function() {
            console.log(this.ver)
        },
        /**
         *DOM 的简易封装
         **/
        $id: function(id) {
            return document.getElementById(id)
        },
        /*根据标签名获取元素，返回元素的节点伪数组*/
        $tag: function(tagName, parent) {
            return (parent || document).getElementsByTagName(tagName);
        },
        /*根据样式名获取元素，返回元素的节点数组。其中className是必填项目*/
        $class: function(className, tagName, parent) {
            //元素可能存在多个className,故匹配我们所需要的className
            var re = new RegExp('(^|\\s)' + className + '(\\s|$)'),
                node = [];

            if (arguments.length === 1) {
                //只传入className
                tagName = "*";
                parent = document;

            } else if (arguments.length === 2 && tagName.constructor === "String") {
                //传入ClassName和节点类型
                parent = document;

            } else if (arguments.length === 2 && tagName.constructor !== "String") {
                //传入ClassName和父亲节点
                tagName = "*"

            } else if (arguments.length === 3) {
                //传入ClassName和节点类型以及父亲节点
            }

            var nodebyTag = parent.getElementsByTagName(tagName);

            for (var i = 0; i < nodebyTag.length; i++) {

                if (re.test(nodebyTag[i].className)) {
                    node.push(nodebyTag[i]);
                }
            }

            return node;
        },
        // 获取当前页面高度
        getPageHeight: function() {
            return document.body.scrollHeight
        },
        //  获取当前页面宽度
        getPageWidth: function() {
            return document.body.scrollWidth
        },
        /* 确定滚动条水平和垂直的位置 */
        getScrollX: function() {
            var de = document.documentElement

            return self.pageXOffset || (de && de.scrollLeft) || document.body.scrollLeft
        },
        getScrollY: function() {
            var de = document.documentElement
            return self.pageYOffset || (de && de.scrollTop) || document.body.scrollTop
        },
        /* 确定浏览器视口的高度和宽度的两个函数 */
        getWindowHeight: function() {
            var de = document.documentElement

            return self.innerHeight || (de && de.clientHeight) || document.body.clientHeight
        },
        getWindowWidth: function() {
            var de = document.documentElement

            return self.innerWidth || (de && de.clientWidth) || document.body.clientWidth
        },
        /**
         * 获取指定元素(elem)的样式属性(name)
         * */
        getStyle: function(elem, name) {
            // 如果存在于style[]中,那么它已被设置了(并且是当前的)
            if (elem.style[name]) {
                return elem.style[name]
            }

            // 否则,测试IE的方法
            else if (elem.currentStyle) {
                return elem.currentStyle[name]
            }

            // 或者W3C的方法
            else if (document.defaultView && document.defaultView.getComputedStyle) {
                name = name.replace(/(A-Z)/g, '-$1')
                name = name.toLowerCase()

                var s = document.defaultView.getComputedStyle(elem, '')
                return s && s.getPropertyValue(name)
            }

            // 否则,用户使用的是其他浏览器
            else {
                return null
            }
        },

        /**
         * 获取元素的真实高度
         * 依赖的getStyle见上面的函数。
         * */
        getHeight: function(elem) {
            return parseInt(this.getStyle(elem, 'height'))
        },
        /**
         * 获取元素的真实宽度
         * 依赖的getStyle见上面的函数
         * */
        getWidth: function(elem) {
            return parseInt(this.getStyle(elem, 'width'))
        },
        /**
         * fn.getCountDown  
         * @description: 倒计时的一段脚本。
         * @param:deadline ->截止日期 符合日期格式，比如 '2016-11-23 18:55:49' 等有效日期。或是 "1477897440"
         * @return -> 截止的天数、小时、分钟、秒数组成的object对象。
         */
        getCountDown: function(deadline) {
            var activeDateObj = {},
                currentDate = new Date().getTime(), //获取当前的时间
                finalDate = new Date(deadline).getTime(), //获取截止日期
                intervaltime = finalDate - currentDate; //有效期时间戳

            /*截止日期到期的话,则不执行下面的逻辑*/
            if (intervaltime < 0) {
                return;
            }

            var totalSecond = ~~(intervaltime / 1000), //得到总秒数
                toDay = ~~(totalSecond / 86400), //得到天数
                toHour = ~~((totalSecond - toDay * 86400) / 3600), //得到小时
                tominute = ~~((totalSecond - toDay * 86400 - toHour * 3600) / 60), //得到分数
                toSeconde = ~~(totalSecond - toDay * 86400 - toHour * 3600 - tominute * 60); //得到秒数

            /*装配obj*/
            activeDateObj.day = toDay;
            activeDateObj.hour = toHour;
            activeDateObj.minute = tominute;
            activeDateObj.second = toSeconde;

            return activeDateObj;
        },
        /**
         * 时间比较
         * @param time 当前时间
         * @param ago  之前时间
         */
        getTimeAgo: function(ago, time) {
            var minute = 60 * 1000, // 1分钟
                hour = 60 * minute, // 1小时
                day = 24 * hour, // 1天
                month = 31 * day, // 月
                year = 12 * month; // 年
            if (!this.isNotEmpty(time)) {
                time = new Date().getTime();
            } else {
                time = time * 1000;
            }
            var diff = time - ago * 1000;
            var r = 0;
            if (diff > day * 3) {
                return this.doDateFormat(new Date(ago * 1000), 'MM-dd hh:mm');
            }
            if (diff > day) {
                r = Math.floor(diff / day);
                return r + "天前";
            }
            if (diff > hour) {
                r = Math.floor(diff / hour);
                return r + "小时前";
            }
            if (diff > minute) {
                r = Math.floor(diff / minute);
                return r + "分钟前";
            }
            return "刚刚";
        },
        /**
         * @function:getRandomNum->生成随机的字符串
         * @param:len->生存随机字符串的长度
         * @tdd->IE6-9 chrome Firefox通过测试
         * 
         */
        getRandomNum: function(len) {
            var rdmString = "";
            //toSting接受的参数表示进制，默认为10进制。36进制为0-9 a-z
            for (; rdmString.length < len; rdmString += Math.random().toString(36).substr(2));
            return rdmString.substr(0, len);
        },
        /**
         * 获取cookie中参数
         */
        getQueryCookie: function(name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg))
                return (arr[2]);
            else
                return null;
        },
        /**
         * 获取location 中参数
         * @param name 是想获取的参数
         * @returns 成功则返回参数值,失败则返回  null
         */
        getQueryString: function(name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },
        /**
         * 获取已知 url 中参数 
         * @param name 是想获取的参数
         * @param url 已知url
         * @returns 成功则返回参数值,失败则返回  null
         * @description 这个还得再改造
         */
        getQstring: function(url, name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = url.match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },

        /**
         * 定位标签
         * @param el
         * @param time
         */
        scrollToElement: function(el, extra, time) {
            if (el) {
                var left = el.offsetLeft,
                    top = el.offsetTop;
                while (el = el.offsetParent) {
                    left -= el.offsetLeft;
                    top -= el.offsetTop;
                }
                scrollTo(Math.abs(left), Math.abs(top) + (extra ? extra : 0));
            }
        },
        /**isURL
         * @description:判断输入的参数是否是个合格的URL,由于url的灵活性和多样性，一下代码并不能测试所有的url都是合法的
         * @param:str->待判断的url参数
         * @return ：true表示符合改正则。
         **/
        isURL: function(str) {
            var strRegex = "^((https|http|ftp|rtsp|mms)?://)" +
                "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
                +
                "(([0-9]{1,3}.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
                +
                "|" // 允许IP和DOMAIN（域名）
                +
                "([0-9a-z_!~*'()-]+.)*" // 域名- www.
                +
                "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]." // 二级域名
                +
                "[a-z]{2,6})" // first level domain- .com or .museum
                +
                "(:[0-9]{1,4})?" // 端口- :80
                +
                "((/?)|" +
                "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
            var re = new RegExp(strRegex);

            return re.test(str);
        },
        /**
         *isCellphone
         * @description:判断输入的参数是否是个合格的手机号码，不能判断号码的有效性，有效性可以通过运营商确定。
         * @param:str ->待判断的手机号码
         * @return: true表示合格输入参数
         * 
         */
        isCellphone: function(str) {
            /**
             *@descrition:手机号码段规则
             * 13段：130、131、132、133、134、135、136、137、138、139
             * 14段：145、147
             * 15段：150、151、152、153、155、156、157、158、159
             * 17段：170、176、177、178
             * 18段：180、181、182、183、184、185、186、187、188、189
             * 
             */
            var pattern = /^(13[0-9]|14[57]|15[012356789]|17[0678]|18[0-9])\d{8}$/;
            return pattern.test(str);
        },
        /**
         *
         * @description: 判断传入的参数的长度是否在给定的有效范围内
         * @param: minL->给定的最小的长度
         * @param: maxL->给定的最大的长度
         * @param: str->待验证的参数
         * @return : true表示合理，验证通过
         * 
         */
        isStrLength: function(minL, maxL, str) {
            return (str.length >= minL && str.length <= maxL) ? true : false;
        },
        /**
         * 暂不支持object为空的判断
         * @description : 判断输入的参数是否为空
         * @return : true表示为输入参数为不空 
         * 
         */
        isNotEmpty: function(data) {
            data = data + "";
            if (data === null || data === undefined || data == "null" || data == "undefined" || data == "" || data.length == 0) {
                return false;
            } else {
                return true;
            }
        },
        /**
         * 判断是否是同天
         * @returns {boolean}
         */
        isCurrDate: function(a, b) {
            var dateA = new Date(a);
            var dateB = new Date(b);
            return tool.dateFormat(dateA, 'dd') == tool.dateFormat(dateB, 'dd');
        },

        /**
         * 日期格式化  yyyy-MM-dd hh:mm:ss.S
         * @description 日期格式化  yyyy-MM-dd hh:mm:ss.S
         * @param data -> 如: new Date() 对像
         * @param fmt -> 如: yyyy-MM-dd hh:mm:ss
         */
        doDateFormat: function(date, fmt) {
            var o = {
                "y+": this.getFullYear(),
                "M+": date.getMonth() + 1, //月份
                "d+": date.getDate(), //日
                "h+": date.getHours(), //小时
                "m+": date.getMinutes(), //分
                "s+": date.getSeconds(), //秒
                "q+": Math.floor((date.getMonth() + 3) / 3), //季度
                "S": date.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt))
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        },

        /**
         * 字符转unicode
         * @param s
         */
        doEncodeToUnicode: function(s) {
            var parseStandard = function(str) {
                if (str.length == 1) {
                    return "000" + str;
                } else if (str.length == 2) {
                    return "00" + str;
                } else if (str.length == 3) {
                    return "0" + str;
                } else {
                    return str;
                }
            }
            var t = '';
            for (var i = 0; i < s.length; i++) {
                t += '\\u' + parseStandard(s.charCodeAt(i).toString(16));
            }
            return t;
        },
        /**
         * 去除特殊字符
         * @description 去除特殊字符
         * @param str-> String
         */
        regExpText: function(str) {
            var pattern = new RegExp(/[^\u4e00-\u9fa5\uFF00-\uFFFFa-zA-Z0-9-,.!~"%@{}\s\[\]()<>`_=+*$￥?:;'，。；？～…、〔〕！@“”×]/igm)
            var rs = "";
            for (var i = 0; i < s.length; i++) {
                rs = rs + str.substr(i, 1).replace(pattern, '');
            }
            return rs;
        },
        /**
         * 数组去重
         */
        uinqueArr: function(arr) {
            var res = [],
                obj = {};
            for (var i = 0; i < arr.length; i++) {
                if (!obj[arr[i]]) {
                    ret.push(arr[i]);
                    obj[arr[i]] = 1;
                }
            }
            return res;
        },
        /**
         * 静态修改url
         * @param 为varables
         */
        replaceParamURL: function(param) {
            var key = param.name,
                value = param.value;
            var oUrl = window.location.href.toString();
            var re = eval('/(' + key + '=)([^&]*)/gi');

            var nUrl = '';
            if (oUrl.indexOf('&' + key + '=') == -1) {
                nUrl = oUrl + '&' + key + '=' + value;
            } else {
                nUrl = oUrl.replace(re, key + '=' + value);
            }
            window.history.replaceState({}, '', nUrl);
        }

    }

    /**
     *
     * @desccrition: 对String类型去除空格的拓展
     * @dir : 被去除空格所在的位置
     * @test: ie6-9 chrome firefox
     */

    String.prototype.trim = function(dir) {
        switch (dir) {
            case 0: //去左边的空格
                return this.replace(/(^\s*)/g, '');
                break;
            case 1: //去右边的空格
                return this.replace(/(\s*$)/g, '');
                break;
            case 2: //去掉所有的空格
                return this.replace(/(\s*)/g, '');
                break;
            default: //去掉两边的空格
                return this.replace(/(^\s*)|(\s*$)/g, '');
        }
    }


    return c
})