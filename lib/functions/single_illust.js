"use strict";

var common = require("./common");

var getillustUrlFromImage = function (img) {
    return img.dataset["src"];
};

var setDownloadLinkForSingleIllust = function(props){
    var img = document.getElementsByClassName("original-image")[0];
    var url = getillustUrlFromImage(img);
    var buttonContainer = document.getElementsByClassName("bookmark-container")[0];
    var button = document.createElement("a");
    button.className = "_bookmark-toggle-button";
    var icon = document.createElement("span");
    icon.className = "bookmark-icon";
    icon.style.backgroundImage = "url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjNjY2NjY2IiBoZWlnaHQ9IjE4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIxOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0xOSA5aC00VjNIOXY2SDVsNyA3IDctN3pNNSAxOHYyaDE0di0ySDV6Ii8+CiAgICA8cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+Cjwvc3ZnPgo=)";
    button.appendChild(icon);
    button.addEventListener("click", function (e) {
        common.sendDownloadCommand({
            props: props,
            extension: common.getIllustExtensionFromImageUrl(url),
            url: url,
            type: "illust"
        }, function () {});
        e.preventDefault();
    });
    buttonContainer.appendChild(button);
};

var isSingleIllustPage = function(){
    return document.getElementsByClassName("_illust_modal").length > 0;
};

module.exports = {
    setDownloadLinkForSingleIllust: setDownloadLinkForSingleIllust,
    isSingleIllustPage: isSingleIllustPage
};
