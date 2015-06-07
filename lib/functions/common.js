/* jshint -W098, -W107 */
/* jshint -W030 */
/* jshint -W033 */
/* global chrome, opera */

"use strict";

var browser = chrome || opera;

var parseJapaneseStyleDate = function(dateString){
    var reg = dateString.match(/(\d\d\d\d)年(\d?\d)月(\d?\d)日 (\d\d):(\d\d)/);
    var ret = new Date(reg[1], reg[2] - 1, reg[3], reg[4], reg[5]);
    return ret;
};

var parseEnglishStyleDate = function(dateString){
    return new Date(dateString);
};

var selectDateParser = function(){
    var workList = document.querySelector(".all a"),
    text = workList.innerText;
    return (text === "作品一覧" || text === "作品目錄" || text === "作品目录") ? parseJapaneseStyleDate : parseEnglishStyleDate;
};

var getIllustId = function(){
    var idx = location.href.lastIndexOf("?"),
        param = location.href.substr(idx + 1).split("&")
                .filter(function(p){ return p.indexOf("illust_id") > -1; })[0]
                .split("=");
    return parseInt(param[1], 10);
};

var getUserId = function(){
    var link = document.querySelector(".user-link"),
    cont = link.href,
    idx = cont.lastIndexOf("=");
    return parseInt(cont.substr(idx + 1), 10);
};

var getIllustTitle = function(){
    var header = document.querySelector(".work-info .title");
    return header.innerText;
};

var getUserName = function(){
    var header = document.querySelector(".user");
    return header.innerText;
};

var getPostDateString = function(){
    var li = document.querySelector(".meta li:first-child");
    return li.innerText;
};

var getIllustDescription = function(){
    var desc = document.evaluate("/html/head/meta[11]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue;
    return desc.content;
};

var getPropaties = function(){
    var parseDate = selectDateParser();
    return {
        illustId: getIllustId(),
        userId: getUserId(),
        illustTitle: getIllustTitle(),
        illustDescription: getIllustDescription(),
        userName: getUserName(),
        postDate: parseDate(getPostDateString()).valueOf()
    };
};

var getIllustExtensionFromImageUrl = function (url) {
    var postfix = url.substring(0, url.lastIndexOf("?"));
    postfix = (postfix || url);
    return postfix.substring(postfix.lastIndexOf("."));
};

var sendDownloadCommand = function(args, cb){
    browser.runtime.sendMessage({
        command: "downloadImage",
        args: args
    }, cb);
};


module.exports = {
    getPropaties: getPropaties,
    getIllustExtensionFromImageUrl: getIllustExtensionFromImageUrl,
    sendDownloadCommand: sendDownloadCommand
};
