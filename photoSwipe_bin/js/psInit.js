var initPhotoSwipeFromDOM = function (gallerySelector) {
    // parse slide data (url, title, size ...) from DOM elements
    // (children of gallerySelector)
    var parseThumbnailElements = function (el) {
        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item

        for (var i = 0; i < numNodes; i++) {
            figureEl = thumbElements[i] // <figure> element

            // include only element nodes
            if (figureEl.nodeType !== 1) {
                continue
            }

            linkEl = figureEl.children[0] // <a> element

            size = linkEl.getAttribute('data-size').split('x')

            // create slide object
            item = {
                src: linkEl.getAttribute('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            }

            if (figureEl.children.length > 1) {
                // <figcaption> content
                item.title = figureEl.children[1].innerHTML
            }

            if (linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = linkEl.children[0].getAttribute('src')
            }

            item.el = figureEl // save link to element for getThumbBoundsFn
            items.push(item)
        }

        return items
    }

    // find nearest parent element
    var closest = function closest(el, fn) {
        return el && (fn(el) ? el : closest(el.parentNode, fn))
    }

    // triggers when user clicks on thumbnail
    var onThumbnailsClick = function (e) {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement

        // find root element of slide
        var clickedListItem = closest(eTarget, function (el) {
            return (el.tagName && el.tagName.toUpperCase() === 'FIGURE')
        })

        if (!clickedListItem) {
            return
        }

        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;

        for (var i = 0; i < numChildNodes; i++) {
            if (childNodes[i].nodeType !== 1) {
                continue
            }

            if (childNodes[i] === clickedListItem) {
                index = nodeIndex
                break
            }
            nodeIndex++
        }

        if (index >= 0) {
            // open PhotoSwipe if valid index found
            openPhotoSwipe(index, clickedGallery)
        }
        return false
    }

    // parse picture index and gallery index from URL (#&pid=1&gid=2)
    // 更新 hash 值
    var photoswipeParseHash = function () {
        var hash = window.location.hash.substring(1),
            params = {}

        if (hash.length < 5) {
            return params
        }

        var vars = hash.split('&')
        for (var i = 0; i < vars.length; i++) {
            if (!vars[i]) {
                continue
            }
            var pair = vars[i].split('=')
            if (pair.length < 2) {
                continue
            }
            params[pair[0]] = pair[1]
        }

        if (params.gid) {
            params.gid = parseInt(params.gid, 10)
        }

        return params
    };

    //打开openPhoto
    var openPhotoSwipe = function (index, galleryElement, disableAnimation, fromURL) {
        var pswpElement = document.querySelectorAll('.pswp')[0],
            gallery,
            options,
            items;

        items = parseThumbnailElements(galleryElement)

        // define options (if needed)
        options = {

            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),  // 当前

            //缩放动画
            getThumbBoundsFn: function (index) {
                // See Options -> getThumbBoundsFn section of documentation for more info
                var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect()

                return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
            },
            tapToClose: true  // 点击关闭

        }

        // PhotoSwipe opened from URL
        if (fromURL) {
            if (options.galleryPIDs) {
                // parse real index when custom PIDs are used
                // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                for (var j = 0; j < items.length; j++) {
                    if (items[j].pid == index) {
                        options.index = j
                        break
                    }
                }
            } else {
                // in URL indexes start from 1
                options.index = parseInt(index, 10) - 1
            }
        } else {
            options.index = parseInt(index, 10)
        }

        // exit if index not found
        if (isNaN(options.index)) {
            return
        }

        if (disableAnimation) {
            options.showAnimationDuration = 0
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options)
        gallery.init()
    };

    // loop through all gallery elements and bind events
    var galleryElements = document.querySelectorAll(gallerySelector)

    for (var i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i + 1)
        galleryElements[i].onclick = onThumbnailsClick
    }

    // Parse URL and open gallery if it contains #&pid=3&gid=1
    var hashData = photoswipeParseHash()
    if (hashData.pid && hashData.gid) {
        openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true)
    }
};

//execute above function
initPhotoSwipeFromDOM('.my-gallery');
// 上面是 官网上的DOM  可不用..

var initGallery = {
    /**
     * 初始化图片浏览器
     * @param gallerySelector
     */
    init: function (gallerySelector) {
        var galleryElements = document.querySelectorAll(gallerySelector);
        //设置 data-pswp-uid
        for (var i = 0, l = galleryElements.length; i < l; i++) {
            galleryElements[i].setAttribute('data-pswp-uid', i + 1);
            galleryElements[i].onclick = initGallery.onThumbnailsClick
        }
        // Parse URL and open gallery if it contains #&pid=3&gid=1
        var hashData = this.photoswipeParseHash();
        if (hashData.pid && hashData.gid) {
            initGallery.openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true)
        }

    },
    /**
     * 更新Hash
     * @returns {{}}
     */
    photoswipeParseHash:function() {
        var hash = window.location.hash.substring(1),
            params = {};

        if (hash.length < 5) {
            return params
        }

        var vars = hash.split('&');
        for (var i = 0; i < vars.length; i++) {
            if (!vars[i]) {
                continue
            }
            var pair = vars[i].split('=');
            if (pair.length < 2) {
                continue
            }
            params[pair[0]] = pair[1]
        }

        if (params.gid) {
            params.gid = parseInt(params.gid, 10)
        }

        return params
    },

    /**
     * 获取Items
     */
    parseThumbnailElements:function(el){

        var thumbElements = el.childNodes,
            numNodes = thumbElements.length,
            items = [],
            figureEl,
            linkEl,
            size,
            item;

        for (var i = 0; i < numNodes; i++) {
            figureEl = thumbElements[i]; // <figure> element

            // include only element nodes
            if (figureEl.nodeType !== 1) {
                continue
            }

            linkEl = figureEl.children[0]; // <a> element
            //linkEl=$(figureEl).find('a');

            size = initGallery.getBig(figureEl).getAttribute('data-size') != undefined ? initGallery.getBig(figureEl).getAttribute('data-size').split('x') :[100,100];

            // create slide object
            item = {
                src: linkEl.getAttribute('href') != undefined ? linkEl.getAttribute('href'):linkEl.getAttribute('data-bigsrc'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10)
            }

            //当pic-thumb 子元素 大于1
            if (figureEl.children.length > 1) {
                // <figcaption> content
                item.title=initGallery.getDes(figureEl);
                //item.title = $(figureEl).find('.description').html();
            }

            if (linkEl.children.length > 0) {
                // <img> thumbnail element, retrieving thumbnail url
                item.msrc = initGallery.getBigSrc(linkEl);
            }

            item.el = figureEl; // save link to element for getThumbBoundsFn
            items.push(item)
        }

        return items
    },
    /**
     * 打开PhotoSwipe
     */
    openPhotoSwipe:function(index, galleryElement, disableAnimation, fromURL){
        var pswpElement = document.querySelectorAll('.pswp')[0], // 获取ROOT DOM模版
            gallery,
            options,
            items;

        items = initGallery.parseThumbnailElements(galleryElement);

        // define options (if needed)
        options = {

            // define gallery index (for URL)
            galleryUID: galleryElement.getAttribute('data-pswp-uid'),  // 当前

            //缩放动画
            getThumbBoundsFn: function (index) {

                // See Options -> getThumbBoundsFn section of documentation for more info
                var thumbnail = initGallery.getBig(items[index].el), // 获取比较大的那个图片
                    pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                    rect = thumbnail.getBoundingClientRect()
                console.log(thumbnail);
                return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
            },
            errorMsg:'<div class=\"pswp__error-msg\">图片加载失败</div>', // 默认图片加载失败的时候显示
            fullscreenEl:false, // 关闭全屏
            shareEl:false, // 关闭分享
            tapToClose: true // 点击关闭

        };

        // PhotoSwipe opened from URL
        if (fromURL) {
            if (options.galleryPIDs) {
                // parse real index when custom PIDs are used
                // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
                for (var j = 0; j < items.length; j++) {
                    if (items[j].pid == index) {
                        options.index = j
                        break
                    }
                }
            } else {
                // in URL indexes start from 1
                options.index = parseInt(index, 10) - 1
            }
        } else {
            options.index = parseInt(index, 10)
        }

        // exit if index not found
        if (isNaN(options.index)) {
            return
        }

        if (disableAnimation) {
            options.showAnimationDuration = 0
        }

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options)
        gallery.init()
    },
    /**
     * 点击小图片
     * @param e
     */
    onThumbnailsClick:function(e){
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;

        var eTarget = e.target || e.srcElement;



        // find root element of slide
        var clickedListItem = initGallery.closest(eTarget, function (el) {
            return (el.tagName && el.tagName.toUpperCase() === 'DIV' && el.getAttribute("data-thumb") )
        });

        if (!clickedListItem) {
            return
        }


        console.log(clickedListItem);
        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        var clickedGallery = clickedListItem.parentNode,
            childNodes = clickedListItem.parentNode.childNodes,
            numChildNodes = childNodes.length,
            nodeIndex = 0,
            index;



        for (var i = 0; i < numChildNodes; i++) {
            if (childNodes[i].nodeType !== 1) {
                continue
            }

            if (childNodes[i] === clickedListItem) {
                index = nodeIndex
                break
            }
            nodeIndex++
        }

        if (index >= 0) {
            // open PhotoSwipe if valid index found
            initGallery.openPhotoSwipe(index, clickedGallery)
        }
        return false

    },
    /**
     * 关闭
     * @param el
     * @param fn
     * @returns {*}
     */
    closest: function closest(el, fn) {
        return el && (fn(el) ? el : this.closest(el.parentNode, fn))
    },

    /**
     * 当有多个img标签-获取 class="big"的图片
     * @param el
     */
    getBig:function getBig(el){
        return el.getElementsByClassName('big')[0];
        //console.log(el.getElementsByClassName('big')[0]);

    },
    /**
     * 获取缩放时的那个小图片SRC
     * @param el
     */
    getBigSrc:function(el){
        return el.getElementsByClassName('big')[0].getAttribute('src');
    },
    /**
     * 获取简介
      * @param el
     */
    getDes:function getDes(el){
        return el.getElementsByClassName('description')[0].innerHTML;
    },

    /**
     * 只提交数据..无实际的DOM元素 可直接打开图片浏览
     * @param index 序列
     * @param items 图片的集合
     *      items:
                 [
                 {
                    msrc:'http://placehold.it/120x120',
                     src: 'http://placehold.it/600x400',
                     w: 600,
                     h: 400,
                     title:"我是图片001" // 这个是简介
                 },
                 {
                    msrc:'http://placehold.it/120x120', //这个是缩放动的那个小图片的地址.
                     src: 'http://placehold.it/1200x900',
                     w: 1200,
                     h: 900
                 }
                 ];
     *
     *
     */
    newPhotoSwipe:function(index,items){
        var pswpElement = document.querySelectorAll('.pswp')[0], // 获取ROOT DOM模版
            gallery,
            options;

        options = {
            errorMsg:'<div class=\"pswp__error-msg\">图片加载失败</div>', // 默认图片加载失败的时候显示
            // define gallery index (for URL)
            //galleryUID: galleryElement.getAttribute('data-pswp-uid'),  // 当前
            fullscreenEl:false, // 关闭全屏
            shareEl:false, // 关闭分享
            tapToClose: true // 点击关闭
        };

        options.index = parseInt(index, 10);
        // exit if index not found
        if (isNaN(options.index)) {
            return
        }
        options.showAnimationDuration = 300; //关闭动画

        // Pass data to PhotoSwipe and initialize it
        gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init()
    }



};
initGallery.init('.detail-pic');