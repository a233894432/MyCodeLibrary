/*!

 @Name：前端基础库
 @Author：Diogo
 @Site：http://www.tomxiang.com
 @License：LGPL


 */
(function ($, w, d) {

    "use strict";

    /**
     * 生成指定长度的随机数
     * @param length
     * @returns {string}
     */
    $.pseudoUnique = function (length) {
        /// <summary>Returns a pseudo unique alpha-numeric string of the given length.</summary>
        /// <param name="length" type="Number">The length of the string to return. Defaults to 8.</param>
        /// <returns type="String">The pseudo unique alpha-numeric string.</returns>

        var len = length || 8,
            text = "",
            possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
            max = possible.length;

        if (len > max) {
            len = max;
        }

        for (var i = 0; i < len; i += 1) {
            text += possible.charAt(Math.floor(Math.random() * max));
        }

        return text;

    };

    /**
     * 判断HTML 中 dir 值
     */
    $.support.rtl = (function () {
             return $("html[dir=rtl]").length ? true : false;
    }());

    /**
     *
     * @descrition:判断是否是合理的IP地址
     * @param:str->待验证的IP地址
     * @return :true合理的IP地址
     *
     */
    $.isIP = function (str) {
        var pattern = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

        return pattern.test(str);
    };

    /**
     *
     * @descrition:判断输入的参数是否是个合格的手机号码，不能判断号码的有效性，有效性可以通过运营商确定。
     * @param:str ->待判断的手机号码
     * @return: true表示合格输入参数
     *
     */
    $.isCellphone = function(str) {
        /**
         *@descrition:手机号码段规则
         * 13段：130、131、132、133、134、135、136、137、138、139
         * 14段：145、147
         * 15段：150、151、152、153、155、156、157、158、159
         * 17段：170、176、177、178
         * 18段：180、181、182、183、184、185、186、187、188、189
         *
         */
        var pattern =  /^(13[0-9]|14[57]|15[012356789]|17[0678]|18[0-9])\d{8}$/;
        return pattern.test(str);
    };
    /**
     *
     * @descrition:判断输入的参数是否是个合格标准的邮箱,并不能判断是否有效，有效只能通过邮箱提供商确定。
     * @param:str ->待验证的参数。
     * @return -> true表示合格的邮箱。
     *
     */
    $.isEmail = function(str){
        /**
         * @descrition:邮箱规则
         * 1.邮箱以a-z、A-Z、0-9开头，最小长度为1.
         * 2.如果左侧部分包含-、_、.则这些特殊符号的前面必须包一位数字或字母。
         * 3.@符号是必填项
         * 4.右则部分可分为两部分，第一部分为邮件提供商域名地址，第二部分为域名后缀，现已知的最短为2位。最长的为6为。
         * 5.邮件提供商域可以包含特殊字符-、_、.
         */
        var pattern = /^([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[-_.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$/;
        return pattern.test(str);
    };

    /**
     *
     * @description: 判断传入的参数的长度是否在给定的有效范围内
     * @param: minL->给定的最小的长度
     * @param: maxL->给定的最大的长度
     * @param: str->待验证的参数
     * @return : true表示合理，验证通过
     *
     */
    $.isAvaiableLength = function(minL,maxL,str){
        return (str.length >= minL && str.length <= maxL) ? true : false;
    };

    /**
     *
     * @descrition: 测试给定的参数是否全部为中文字符，如"中test"不会通过 。
     * @param->str : 传入的参数，类型为字符串。
     * @return : true表示全部为中文,false为不全是中文，或没有中文。
     *
     */
    $.isChinese = function (str) {
        var pattern = /^[\u0391-\uFFE5]+$/g;
        return pattern.test(str);
    };
    /**
     *  getQuery 从URL地址栏中获取model的参数
     * @param name
     * @param url 可传.可不传
     * @returns {*}
     */
    $.getQuery= function (name,url) {
        var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
        var url= url || window.location.search.substr(1).match(reg);
        if (reg.test(url)) return decodeURIComponent(RegExp.$2.replace(/\+/g, " ")); return "";
    }




} (jQuery, window, document));