// ==UserScript==
// @include http://www.pixiv.net/member_illust.php?*
// ==/UserScript==

/* jshint -W098 */
/* jshint -W030 */
/* jshint -W033 */

var browser = chrome || opera;

var selectDateParser = function(){
    var workList = document.querySelector(".all a");
    text = workList.innerText;
    return (text === "作品一覧" || text === "作品目錄" || text === "作品目录")? parseJapaneseStyleDate : parseEnglishStyleDate;
};

var parseJapaneseStyleDate = function(dateString){
    var reg = dateString.match(/(\d\d\d\d)年(\d?\d)月(\d?\d)日 (\d\d):(\d\d)/);
    var ret = new Date(reg[1], reg[2] - 1, reg[3], reg[4], reg[5]);
    return ret;
};

var parseEnglishStyleDate = function(dateString){
    return new Date(dateString);
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
    var desc = document.evaluate('/html/head/meta[11]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE,null ).singleNodeValue;
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

var getIllustExtensionFromImage = function (img) {
    var postfix = img.src.substring(0, img.src.lastIndexOf("?"));
    postfix = (postfix || img.src);
    return postfix.substring(postfix.lastIndexOf("."));
};

var getillustUrlFromImage = function (img) {
    return img.src;
};

var setDownloadLink = function(type, props, pageNum){
    if (type === "manga")
        props.page = pageNum;

    var img = document.evaluate('/html/body/img', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE,null ).singleNodeValue;
    var a = document.createElement("a");
    a.href = "javascript:void(0)";
    a.addEventListener("click", function (e) {
        browser.runtime.sendMessage({
            command: "downloadImage",
            args: {
                props: props,
                extension: getIllustExtensionFromImage(img),
                url: getillustUrlFromImage(img),
                type: type
            }
        }, function () {});
        e.preventDefault();
    });
    a.innerText = "Download Image";
    a.style.display = "block";
    a.style.width = "100%";
    a.style.marginBottom = "10px";
    a.style.color = "#258FB8";
    a.style.fontFamily = "Arial, メイリオ, Meiryo, sans-serif";
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

