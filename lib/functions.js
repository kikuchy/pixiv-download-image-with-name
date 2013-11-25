// ==UserScript==
// @include http://www.pixiv.net/member_illust.php?*
// ==/UserScript==

/* jshint -W098 */
/* jshint -W030 */
/* jshint -W033 */

var browser = chrome || opera;

var selectDateParser = function(){
    var workList = document.evaluate('//*[@id="wrapper"]/div[1]/div[1]/div/nav/ul/li[2]/a', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue,
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

var getIllustId = function(){
    var link = document.evaluate('/html/head/link[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE,null ).singleNodeValue,
    cont = link.href,
    idx = cont.lastIndexOf("/");
    return parseInt(cont.substr(idx + 1), 10);
};

var getUserId = function(){
    var link = document.evaluate('//*[@id="wrapper"]/div[1]/div[2]/div/div[1]/a', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE,null ).singleNodeValue,
    cont = link.href,
    idx = cont.lastIndexOf("=");
    return parseInt(cont.substr(idx + 1), 10);
};

var getIllustTitle = function(){
    var header = document.evaluate('//*[@id="wrapper"]/div[1]/div[1]/div/section[1]/div/h1', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE,null ).singleNodeValue;
    return header.innerText;
};

var getUserName = function(){
    var header = document.querySelector(".user");
    return header.innerText;
};

var getPostDateString = function(){
    var li = document.evaluate('//*[@id="wrapper"]/div[1]/div[1]/div/section[1]/div/ul/li[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE,null ).singleNodeValue;
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

var setDownloadAttribute = function(props){
    var img = document.evaluate('/html/body/img', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE,null ).singleNodeValue;
    var a = document.createElement("a");
    a.href = img.src;
    var ext = img.src.substring(0, img.src.lastIndexOf("?"));
    ext = (ext || img.src);
    ext = ext.substring(ext.lastIndexOf("."));
    var option = browser.runtime.sendMessage("requestSettings", function(response){
        var format = response.illustname;
        a.download = formatFileName(props, format) + ext;
        a.innerText = "Download Image";
        a.style.display = "block";
        a.style.width = "100%";
        a.style.marginBottom = "10px";
        a.style.color = "#258FB8";
        a.style.fontFamily = "Arial, メイリオ, Meiryo, sans-serif";
        document.body.insertBefore(a, img);
    });
};

var appendScriptTag = function(content){
    var script = window.document.createElement("script");
    script.innerText = content;
    window.document.body.appendChild(script);
};

var createNewImagePathFunction = function(props){
    return "window.pixiv.mangaViewer.imagePath = function(page) {\
		return '/member_illust.php?' + pixiv.queryString({\
			mode     : 'manga_big',\
			illust_id: pixiv.context.illustId,\
			page     : page - 1\
		}) + '&namingdata=" + encodeURIComponent(JSON.stringify(props)) + "';\
};";
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

var setDownloadAttributeManga = function(props, page){
    var img = document.evaluate('/html/body/img', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE,null ).singleNodeValue;
    var ext = img.src.substring(0, img.src.lastIndexOf("?"));
    ext = ext || img.src;
    ext = ext.substring(ext.lastIndexOf("."));
    var a = document.createElement("a");
    a.href = img.src;
    browser.runtime.sendMessage("requestSettings",function(response){
        var format = response.manganame;
        props.page = page + 1;
        a.download = formatFileName(props, format) + ext;
        a.innerText = "Download Image";
        a.style.display = "block";
        a.style.width = "100%";
        a.style.marginBottom = "10px";
        a.style.color = "#258FB8";
        a.style.fontFamily = "Arial, メイリオ, Meiryo, sans-serif";
        document.body.insertBefore(a, img);
    });
};

var setPropatiesToNextPageManga = function(props){
    var ancs = document.getElementsByClassName("full-size-container");
    for(var i = 0; i < ancs.length; i++){
        var a = ancs[i];
        a.href = a.href + "&namingdata=" + encodeURIComponent(JSON.stringify(props));
    }
};

