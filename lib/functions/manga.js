"use strict";

var common = require("./common");

var setPropatiesToNextPage = function(props){
    var div = document.getElementsByClassName("works_display")[0];
    var a = div.children[0];
    a.href = a.href + "&namingdata=" + encodeURIComponent(JSON.stringify(props));
};

var getPropatiesFromPreviousPage = function(){
    var url = document.location.href,
    paramIndex = url.indexOf("?"),
    params = url.substr(paramIndex + 1).split("&");
    var res;
    params.forEach(function(param){
        var tmp = param.split("="),
        key = tmp[0],
        value = tmp[1];
        if(key === "namingdata"){
            res = value;
            return;
        }
    });
    return JSON.parse(decodeURIComponent(res));
};

var setDownloadLink = function(type, props, pageNum){
    if (type === "manga") {
        props.page = pageNum;
    }

    var img = document.evaluate("/html/body/img", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue;
    var url = getillustUrlFromImage(img);
    var a = document.createElement("a");
    a.addEventListener("click", function (e) {
        common.sendDownloadCommand({
            props: props,
            extension: common.getIllustExtensionFromImageUrl(url),
            url: url,
            type: type
        }, function () {});
        e.preventDefault();
    });
    a.innerText = "Download Image";
    a.style.display = "block";
    a.style.width = "100%";
    a.style.marginBottom = "10px";
    a.style.color = "#258FB8";
    a.style.fontFamily = "Arial, メイリオ, Meiryo, sans-serif";
    a.style.cursor = "pointer";
    document.body.insertBefore(a, img);
};

var getPageNum = function(){
    var url = document.location.href,
    paramIndex = url.indexOf("?"),
    params = url.substr(paramIndex + 1).split("&");
    var res;
    params.forEach(function(param){
        var tmp = param.split("="),
        key = tmp[0],
        value = tmp[1];
        if(key === "page"){
            res = value;
            return;
        }
    });
    return parseInt(res, 10);
};

var setPropatiesToNextPageManga = function(props){
    var ancs = document.getElementsByClassName("full-size-container");
    for(var i = 0; i < ancs.length; i++){
        var a = ancs[i];
        a.href = a.href + "&namingdata=" + encodeURIComponent(JSON.stringify(props));
    }
};

var getillustUrlFromImage = function (img) {
    return img.src;
};

var isMangaIllustPage = function(){
    return document.getElementsByClassName("_work manga multiple").length > 0;
};

module.exports = {
    getPropatiesFromPreviousPage: getPropatiesFromPreviousPage,
    setPropatiesToNextPage: setPropatiesToNextPage,
    setPropatiesToNextPageManga: setPropatiesToNextPageManga,
    setDownloadLink: setDownloadLink,
    getPageNum: getPageNum,
    isMangaIllustPage: isMangaIllustPage
};
