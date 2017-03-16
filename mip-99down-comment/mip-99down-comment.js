/**
 * @file mip-99down-comment 评论组件
 * @author www.99down.com
 */
define(function (require) {
    var $ = require('zepto');
    var customElem = require('customElement').create();
    // 按钮效果
    function validate() {
        var text = $('.w-text textarea').val();
        var len = text.length;
        var zh = text.replace(/[\x00-\xff]/g, '').length;
        var tlen = Math.ceil((len + zh) / 2);
        if (tlen < 5) {
            $('#verify').addClass('disable');
        }
        else {
            $('#verify').removeClass('disable');
        }
    }


    function comment(o) {
        var ajaxUrl = $(o).find('mip-form').attr('url');
        var oul = $('#comment-list');
        var modelid = $('#app-modelid').val();
        var catid = $('#app-catid').val();
        var oid = $('#app-id').val();
        var oli = oul.find('li');
        var p = Math.floor(oli.length / 5 + 1);
        // 时间函数
        function time(d) {
            var result = '';
            result += [d.getFullYear(), d.getMonth() + 1, d.getDate()].join('/');
            return result.replace(/(-|\:)(\d[^\d])/g, '$1' + '0$2');
        }
        // 写入评论
        function writeComment() {
            oli = oul.find('li');
            $.ajax({
                url: ajaxUrl + 'index.php',
                data: {
                    m: 'content',
                    c: 'index',
                    a: 'mip_comment',
                    content: $('.w-text textarea').val(),
                    SoftID: oid,
                    Softmodelid: modelid,
                    Softcatid: catid,
                    CommentTpye: 2
                },
                beforeSend: function () {
                    if ($('#submit #verify').hasClass('disable')) {
                        alert('\u60a8\u8bc4\u8bba\u5199\u7684\u592a\u77ed\u5566\uff01');
                        return false;
                    }
                },
                success: function () {
                    var html = '<li><p class="user">\u60a8\u53d1\u8868\u7684\u8ddf\u8d34<time><font color="red">'
                    + time(new Date()) + '</font></time></p><p>' + $('.w-text textarea').val() + '<p></li>';
                    oli.length === 0 ? oul.html(html) : oli.first().before(html);
                    $('#comment #submit').hide();
                    $('#view-comment').show();
                    $('.w-text textarea').val('').focus();
                }
            });
        }
        $('#submit #verify').click(function () {
            writeComment();
            return false;
        });
        // 读取评论
        function readComment() {
            oli = oul.find('li');
            p = Math.floor(oli.length / 5 + 1);
            $.ajax({
                type: 'get',
                url: ajaxUrl + 'index.php',
                data: {
                    m: 'content',
                    c: 'index',
                    a: 'mip_comment',
                    modelid: modelid,
                    catid: catid,
                    id: oid,
                    page: p,
                    CommentTpye: 1
                },
                success: function (data) {
                    var html = '';
                    var data = (new Function('', 'return' + data))();
                    var userName = data.sUserName;
                    var userData = data.sDateAndTime;
                    var userText = data.sContent;
                    for (var i = 0; i < userName.length; i++) {
                        html += '<li><p class="user">' + userName[i] + '<time>'
                        + userData[i] + '</time></p><p>' + decodeURIComponent(userText[i]) + '</p></li>';
                    }
                    if (data.RecordCount > 5) {
                        $('#view-comment .button-status-complete').css('display', 'block');
                        $('#comment .button').show();
                    }
                    if (p >= data.PageCount) {
                        $('#view-comment .button').text('没有更多评论了！').unbind('click');
                    }
                    oli.length === 0 ? oul.html(html) : oli.last().after(html);
                }
            });
        }

        readComment();

        $('#view-comment .button').bind('click', function () {
            readComment();
        });

        // 评论效果
        $('#view-comment header .fb').click(function () {
            $('#view-comment').css('display', 'none');
            $('#submit').css('display', 'block');
        });
        $('#cancel').click(function () {
            $('#view-comment').css('display', 'block');
            $('#submit').css('display', 'none');
        });
        $('.w-text textarea').keyup(validate);
    }

    customElem.prototype.build = function () {
        // this.element 可取到当前实例对应的 dom 元素
        var element = this.element;
        comment(element);
    };

    return customElem;
});
