"use strict";

var common = require("./common");

var getillustUrlFromImage = function (img) {
    return img.dataset["src"];
};

var setDownloadLinkForSingleIllust = function(props){
    var img = document.getElementsByClassName("original-image")[0];
    var url = getillustUrlFromImage(img);
    var buttonContainer = document.getElementsByClassName("bookmark-container")[0];
    var button = document.createElement("button");
    button.className = "_button";
    button.innerText = "I";
    button.style.fontFamily = "PixivIconsRegular";
    button.style.fontSize = "1.5em";
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
