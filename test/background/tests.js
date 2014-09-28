/* global   module,
            test,
            equal,
            deepEqual */
/* global   getLocalSettings,
            formatFileName */

module("backgrounds", {
    setup: function(){
        window.expect = {};
        window.expect.localSetting = {
            illust: "{illustTitle} - {userName} - {illustId}",
            manga: "{illustTitle} - {userName} - {illustId}_{page}"
        };
        window.expect.formattedName = {
            illust: "落書きわかひま - BIG豆腐 - 35153367",
            manga: "落書きまとめ2 - u.u - 42415526_3"
        };
        window.expect.worksProps = {
            illust: {
                illustId: 35153367,
                userName: "BIG豆腐",
                illustTitle: "落書きわかひま"
            },
            manga: {
                illustId: 42415526,
                userName: "u.u",
                illustTitle: "落書きまとめ2",
                page: 3
            }
        };
        localStorage.clear();
        localStorage.illust = window.expect.localSetting.illust;
        localStorage.manga = window.expect.localSetting.manga;
    }
});
test("getLocalSettings", function(){
    var actual = getLocalSettings();
    deepEqual(actual, window.expect.localSetting, "localStorageから値を取り出せる");
});
test("formatFileName", function(){
    var format = window.expect.localSetting;
    var actual = formatFileName(window.expect.worksProps.illust, format.illust);
    equal(actual, window.expect.formattedName.illust, "イラストのファイル名がフォーマットされている");
    actual = formatFileName(window.expect.worksProps.manga, format.manga);
    equal(actual, window.expect.formattedName.manga, "漫画のファイル名がフォーマットされている");
});
