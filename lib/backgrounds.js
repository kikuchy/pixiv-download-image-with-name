/* global chrome, opera */

var getLocalSettings = function(){
    return {
        illust: localStorage.illustname || "{illustTitle} - {userName} - {illustId}",
        manga: localStorage.manganame || "{illustTitle} - {userName} - {illustId}_{page}"
    };
};

var executeDownload = function(filename, url){
    browser.downloads.download({
        url:url,
        filename: filename,
        conflictAction: "uniquify"
    });
};

var formatFileName = function(props, format){
    var ret = format;
    var expressions = [
        "illustId",
        "userId",
        "illustTitle",
        "illustDescription",
        "userName",
        "postDate",
        "page"
    ];
    expressions.forEach(function(p){
        ret = ret.replace("{" + p + "}", props[p]);
    });
    return ret;
};

var downloadImage = function(type, props, extension, url){
    var format = getLocalSettings()[type];
    var filename = formatFileName(props, format) + extension;
    executeDownload(filename, url);
};

var setHookForReferer = function() {
    var filter = {
        urls: ["*://*.pixiv.net/*"],
        types: ["other"]
    };
    var options = ["blocking", "requestHeaders"];
    browser.webRequest.onBeforeSendHeaders.addListener(function (details) {
        if (details.url.match(/(\.jp.?g|\.png|\.gif)$/))
            details.requestHeaders.push({
                name: "Referer",
                value: "http://www.pixiv.net/member_illust.php"
            });
        return {requestHeaders: details.requestHeaders};
    }, filter, options);
};

var browser = chrome || opera;
setHookForReferer();
browser.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.command === "downloadImage")
        sendResponse(downloadImage(request.args.type, request.args.props, request.args.extension, request.args.url));
});
