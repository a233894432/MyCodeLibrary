/**
 * 分页插件
 * target：装载分页元素的容器
 * options:object
 *      currentPage：当前的页数
 *      pageSize：每页显示数量
 *      showPages：中间部分一共要显示多少页
 *      total:总数据条数
 *      jumpTo:执行跳转函数
 * Created by diogo on 2017年7月6日14:22:08.
 */
'use strict';
define(["jquery"], function($) {
    var PageSize = 10,
        ShowPages = 10,
        Doc = document;
    var elementPool = (function() {
        var index = 0,
            pool = [];
        return {
            getEle: function() {
                if (index > pool.length - 1) {
                    pool[index] = Doc.createElement("a")
                }
                var ele = pool[index];
                index++;
                return ele;
            },
            reset: function() {
                index = 0;
            }
        }
    })();
    var creatPage = (function() {
        var hasBlind = false,
            currentPage = 1;
        return {
            init: function(target, options) {
                elementPool.reset();
                currentPage = options.currentPage
                creatHtml(target, options);
                var callBack = options.jumpTo;
                if (!hasBlind) {
                    $(target).on("click", ".pre", function() {
                        callBack && callBack.call(this, currentPage - 1)
                    });
                    $(target).on("click", ".next", function() {
                        callBack && callBack.call(this, currentPage + 1)
                    });
                    $(target).on("click", ".pager-a", function() {
                        var num = $(this).text() - 0;
                        callBack && callBack.call(this, num)
                    });

                    hasBlind = true;
                }
            },
            reset: function() {
                // 重新绑定
                hasBlind = false
            }

        }
    })();

    function creatHtml(target, options) {
        $(target).empty();
        var frag = Doc.createDocumentFragment(),
            currentPage = options.currentPage || 1,
            pageSize = options.pageSize || PageSize,
            showPages = options.showPages || ShowPages,
            total = options.total,
            totalPage = Math.ceil(total / pageSize),
            middlePage = Math.floor(showPages / 2),
            i = 0;
        if (!total) {
            console.log("缺少总数据total参数，给个数行不行！！");
            return
        }
        //判断是否显示“上一页”
        if (currentPage !== 1) {
            var a = elementPool.getEle();
            a.className = "pre";
            a.innerText = "上一页";
            frag.appendChild(a);
        }
        if (currentPage <= middlePage || totalPage <= showPages) {
            num = 1;
        } else if (currentPage + showPages - middlePage >= totalPage) {
            num = totalPage - showPages + 1
        } else {
            num = currentPage - middlePage + 1
        }
        totalPage <= showPages && (showPages = totalPage)
        for (; i < showPages; i++) {
            var a = elementPool.getEle(),
                num;
            a.className = i + num == currentPage ? "active" : "pager-a";
            a.innerText = i + num;
            frag.appendChild(a);
        }
        //判断是否显示“下一页”
        if (currentPage !== totalPage) {
            var a = elementPool.getEle();
            a.className = "next";
            a.innerText = "下一页";
            frag.appendChild(a);
        }
        $(target)[0].appendChild(frag);
    }
    return creatPage;
});