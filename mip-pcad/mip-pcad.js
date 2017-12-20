/**
 * @file mip-pcad 组件
 * @author Jesse
 */
define(function (require) {
    var target;
    var timer;
    var adId;
    var rate;
    var customElement = require('customElement').create();
    var bingEvent = function (element, adid) {
        var closeBtn = target.querySelector('.close-btn');
        closeBtn.onclick = function () {
            window.document.getElementById('adWrap' + adid).style.display = 'none';
        };
    };
    var triggerPv = function (pvcode) {
        if (pvcode && pvcode !== '{SRC2}') {
            (window['tmp' + 1 * new Date()] = new Image()).src = pvcode.replace(/\[timestamp\]/i, new Date() * 1);
        }
    };
    function resizeTimer(wraper, ele) {
        clearTimeout(timer);
        timer = setTimeout(function () {
            change(wraper, ele);
        }, 30);
    }
    function change(wraper, ele) {
        var viewW;
        if (!ele) {
            return;
        }
        viewW = getWidth(wraper);
        viewW = (viewW > 750) ? 750 : viewW;
        ele.width = viewW;
        ele.height = parseFloat(viewW / rate).toFixed(2);
    }
    function getWidth(obj) {
        var w = obj && (typeof obj.getBoundingClientRect !== 'undefined') && (1 * obj.getBoundingClientRect().width);
        return (1 * w) || 640;
    }
    var setLocationAd = function (str) {
        if (str === '') {
            return;
        }
        var data = JSON.parse(str);
        var jsAd = data['jsad'];
        var loc = data['id'];
        var htmlAd = data['htmlad'];
        target = document.getElementsByClassName(loc)[0];
        if (jsAd) {
            var js = document.createElement('script');
            js.innerHTML = jsAd;
            target.appendChild(js);
        }
        else if (htmlAd) {
            var adId = data['adId'];
            var size = data['size'];
            var reg = (/^[^\d]*(\d+)x(\d+).*$|^.*$/);
            var w = 1 * size.replace(reg, '$1') || 640;
            var h = 1 * size.replace(reg, '$2') || 100;
            var ifr = [
                '<div style="width:100%;margin:0 auto;text-align:center;" id="wrapAd' + adId + '">',
                '<iframe id="ad' + adId + '" class=' + loc + ' src="' + htmlAd + '" scrolling="no" frameborder="0" ',
                'width="' + w + '" height="' + h + '" style="display: block; border: 0px; margin: 0px auto;">',
                '</iframe>',
                '</div>'];
            target.innerHTML = ifr.join('');
            var wraper = document.getElementById('wrapAd' + adId + '');
            var ele = document.getElementById('ad' + adId + '');
            rate = (w / h);
            window.addEventListener('resize', resizeTimer(wraper, ele), false);
            resizeTimer(wraper, ele);
        }
        else {
            adId = data['adId'];
            var src = data['src'];
            var pvcode = data['pv'];
            var link = data['link'];
            var html = [
                '<div style="position: relative;" id="adWrap' + adId + '">',
                '<a target="_blank" id="ad' + adId + '" href="' + link + '">',
                '<img src="' + src + '" style="width:100%; max-width:640px;">',
                '</a>',
                '<span class="close-btn">X</span>',
                '<span class="ad-tip">广告</span>',
                '</div>'];
            target.innerHTML = html.join('');
            triggerPv(pvcode);
            bingEvent(target, adId);
        }
    };
    var ajax = function (url, sccuessFn) {
        var xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.send(null);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    sccuessFn(xhr.responseText);
                }
            }
        };
    };
    /**
     * 第一次进入可视区回调，只会执行一次
     */

    customElement.prototype.firstInviewCallback = function () {
        target = this.element;
        var loc = target.className.replace(/^([^\s]+\.).*/, '$1');
        var url = '//ivy.pconline.com.cn/show?id=' + loc + '&media=html&mip';
        ajax(url, setLocationAd);
    };
    return customElement;
});
