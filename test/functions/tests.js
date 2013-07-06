/* global module */
/* global test */
/* global equal */
/* global deepEqual */
/* global setDownloadAttribute */
/* global getPropatiesFromPreviousPage */
/* global setPropatiesToNextPage */
/* global formatFileName */
/* global parseDate */
/* global getPostDateString */
/* global getUserName */
/* global getIllustDescription */
/* global getIllustTitle */
/* global getUserId */
/* global getIllustId */
/* global getPropaties */
/* global appendScriptTag */

module("functions", {
    setup: function(){
        window.pixiv = {
            context: {
                illustId: 36842281,
                userId: 154806,
                illustTitle: "雨上がり",
                userName: "uki"
            },
            mangaViewer: {}
        };
        window.expect = {
            illustId: 36842281,
            userId: 154806,
            illustTitle: "雨上がり",
            illustDescription: "しっとり。",
            userName: "uki",
            postDate: (new Date(1372977720000)).valueOf()
        };
        if(document.location.href.indexOf("?") < 1)
            window.history.pushState("", document.title, document.location.href + "?mode=big&illust_id=36842281&namingdata=%7B%22illustId%22%3A36842281%2C%22userId%22%3A154806%2C%22illustTitle%22%3A%22%E9%9B%A8%E4%B8%8A%E3%81%8C%E3%82%8A%22%2C%22illustDescription%22%3A%22%E3%81%97%E3%81%A3%E3%81%A8%E3%82%8A%E3%80%82%22%2C%22userName%22%3A%22uki%22%2C%22postDate%22%3A1372977720000%7D&page=0");
    }
});

test("getPropaties", function(){
    var props = getPropaties();
    deepEqual(props, window.expect, "取得して来たパラメーターは一致する");
});

test("getIllustId", function(){
    var illustId = getIllustId();
    var expect = 36842281;
    equal(illustId, expect, "イラストIDを取得する");
});

test("getUserId", function(){
    var userId = getUserId();
    var expect = 154806;
    equal(userId, expect, "ユーザーのIDを取得する");
});

test("getIllustTitle", function(){
    var illustTitle = getIllustTitle();
    var expect = "雨上がり";
    equal(illustTitle, expect, "イラストのタイトルを取得する");
});

test("getIllustDescription", function(){
    var description = getIllustDescription();
    var expect = "しっとり。";
    equal(description, expect, "イラストの説明文を取得する");
});

test("getUserName", function(){
    var userName = getUserName();
    var expect = "uki";
    equal(userName, expect, "ユーザーの名前を取得する");
});

test("getPostDateString", function(){
    var dateString = getPostDateString();
    var expect = "2013年7月5日 07:42";
    equal(dateString, expect, "投稿日時の文字列表現を取得する");
});

test("parseDate", function(){
    var date = parseDate("2013年7月5日 07:42");
    var expect = new Date(1372977720000);
    equal(date.valueOf(), expect.valueOf(), "日時のパースを行う");
});

test("formatFileName", function(){
    var propaties = window.expect;
    var fileName = formatFileName(propaties, "{illustTitle} - {userName} - {illustId}");
    var expect = "雨上がり - uki - 36842281";
    equal(fileName, expect, "与えられたフォーマット指定子からファイル名を生成する");
});

test("setDownloadAttribute", function(){
    var a = document.createElement("a");
    a.download = "雨上がり - uki - 36842281";
    equal(a.download, "雨上がり - uki - 36842281", "a[download]に正しく値をセットできる");
});

test("setPropatiesToNextPage", function(){
    setPropatiesToNextPage(window.expect);
    var div = document.getElementsByClassName("works_display")[0];
    var a = div.children[0];
    var slashIndex = a.href.lastIndexOf("/"),
    href = a.href.substr(slashIndex + 1);
    var expect = "member_illust.php?mode=big&illust_id=36842281&namingdata=%7B%22illustId%22%3A36842281%2C%22userId%22%3A154806%2C%22illustTitle%22%3A%22%E9%9B%A8%E4%B8%8A%E3%81%8C%E3%82%8A%22%2C%22illustDescription%22%3A%22%E3%81%97%E3%81%A3%E3%81%A8%E3%82%8A%E3%80%82%22%2C%22userName%22%3A%22uki%22%2C%22postDate%22%3A1372977720000%7D";
    equal(href, expect, "GETパラメーターに値を正しく入れている");
});

test("getPopatiesFromPreviousPage", function(){
    var actual = getPropatiesFromPreviousPage();
    deepEqual(actual, window.expect, "GETパラメーターから値を正しく取得できる");
});

test("setDownloadAttribute", function(){
    setDownloadAttribute(window.expect);
    var a = document.evaluate('/html/body/a', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE,null ).singleNodeValue;
    equal(a.download, "雨上がり - uki - 36842281", "移動先のページで正しくdownload attributeに値をセットできている");
    document.body.removeChild(a);
});

test("appendScriptTag", function(){
    var expect = "var num = 1;";
    appendScriptTag(expect);
    var tags = document.getElementsByTagName("script"),
        script = tags[tags.length - 1];
    equal(script.innerText, expect, "任意の内容のscriptタグを挿入できる");
});

test("createNewImagePathFunction", function(){
    var expect = "window.pixiv.mangaViewer.imagePath = function(page) {\
		return '/member_illust.php?' + pixiv.queryString({\
			mode     : 'manga_big',\
			illust_id: pixiv.context.illustId,\
			page     : page - 1\
		}) + '&namingdata=%7B%22illustId%22%3A36842281%2C%22userId%22%3A154806%2C%22illustTitle%22%3A%22%E9%9B%A8%E4%B8%8A%E3%81%8C%E3%82%8A%22%2C%22illustDescription%22%3A%22%E3%81%97%E3%81%A3%E3%81%A8%E3%82%8A%E3%80%82%22%2C%22userName%22%3A%22uki%22%2C%22postDate%22%3A1372977720000%7D';\
};";
    var actual = createNewImagePathFunction(window.expect);
    equal(actual, expect, "新しいimagePathを作れる");
});

test("getPageNum", function(){
    var expect = 0;
    var actual = getPageNum();
    equal(actual, expect, "URLからページ番号を取得する");
});

test("setDownloadAttributeManga", function(){
    setDownloadAttributeManga(window.expect, 0);
    var a = document.evaluate('/html/body/a', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE,null ).singleNodeValue;
    equal(a.download, "雨上がり - uki - 36842281_1", "移動先の漫画イラストオリジナルサイズ表示ページで正しくdownload attributeに値をセットできている");
    document.body.removeChild(a);
});

