+function () {
    if (window.insertJs) {
        // 防止重复插入
        return;
    }

    window.insertJs = 1;

// 请求源代码，并过滤某些东西
    function getLink(url, fn) {
        $.get(url, {byAjax: +new Date}, function (str) {
            fn(str.replace(/navigator.platform/gi,'navigator.userAgent').replace(/debugger/gi,''));
            return;
            var cut = str
                .replace(/<div style="display:none">[\s\S]*?<\/div>/gi, '')
                .match(/<div class="html5play">[\s\S]*?<\/div>|<em id="hits">[\s\S]*?<\/script>|<a\s[^>]*>[\s\S]*?<\/a\s*>|<div id="A">[\s\S]*?<\/div>/ig);
            cut = cut ? cut + '' : '';
            fn(cut);
            var js = cut.match(/\/(upload\/playdata\/[^\.]*|js\/playerconfig|js\/player)\.js/gi) || [];
            var otherJs = '';
            var ma = str.match(/var\s+SitePath\s+[^<]+/gi);
            otherJs += ma ? ma.join('') : '';
            var jsCode = [];

            for (var i = 0; i < js.length; i++) {
                $.get('http://' + location.hostname + js[i], {}, function (code) {
                    jsCode.push(code);

                    if (jsCode.length === js.length) {
                        jsCode = jsCode.join('');
                        jsCode = jsCode.replace(/debugger/gi, '');
                        window.player = new Function('$', 'window.$ = $;' + otherJs + ';' + jsCode + ';MAC.Hits("vod","2296")')($);
                    }
                });
            }
        }, 'text');
    }

    getLink(location.href, function (str) {
        return document.write(str);
        $('#jsWin').html(str);
    })


}();