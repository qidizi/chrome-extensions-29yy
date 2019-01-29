chrome.webRequest.onHeadersReceived.addListener(function onHeadersReceivedFn(info) {
    if (info.type !== "main_frame" || /\.(js|css|jpg|png|gif)\??/.test(info.url)) {
        return;
    }

    return {
        responseHeaders: [
            {name: "Content-Type", value: "text/plain"},
            {name: "Transfer-Encoding", value: "chunked"},
            {name: "Connection", value: "close"},
            {name: "Vary", value: "Accept-Encoding"},
            {name: "ETag", value: 'W/"5b1b3de2-8b69"'},
            {name: "Content-Encoding", value: "gzip"}
        ]
    };
}, {urls: ["https://*.29yy.tv/*"]}, ['blocking']);


chrome.webRequest.onCompleted.addListener(function onCompletedFn(info) {
    if ("main_frame" !== info.type || info.url.indexOf('byAjax') > -1) {
        //不是输入网址、属于ajax时、已经插入了，就不需要插入js
        return;
    }

    chrome.tabs.executeScript(info.tabId, {
        code: 'document.write("<!DOCTYPE html>' +
        '<html>' +
        '<head>' +
        '<title>qidizi</title>' +
        '</head>' +
        '<body>' +
        '<div id=\'jsWin\'></div>' +
        '</body>' +
        '</html>");document.close();'
    });
    chrome.tabs.insertCSS(info.tabId, {file: 'css.css'});
    chrome.tabs.executeScript(info.tabId, {file: 'jq.js'});
    chrome.tabs.executeScript(info.tabId, {file: 'insert.js'});
}, {urls: ["https://*.29yy.tv/*"]}, ['responseHeaders']);



