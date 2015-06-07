"use strict";

(function(){
    var cmUtil = require("./functions/common");
    var singleIllust = require("./functions/single_illust");
    var manga = require("./functions/manga");

	document.addEventListener("DOMContentLoaded", function(){
		if(window.location.href.indexOf("mode=medium") !== -1){
            var props = cmUtil.getPropaties();
            if(singleIllust.isSingleIllustPage()){
                singleIllust.setDownloadLinkForSingleIllust(props);
            }else{
                manga.setPropatiesToNextPage(props);
            }
		}else if(window.location.href.indexOf("mode=big") !== -1){
			manga.setDownloadLink("illust", manga.getPropatiesFromPreviousPage(), -1);
		}else if(window.location.href.indexOf("mode=manga_big") !== -1){
            manga.setDownloadLink("manga", manga.getPropatiesFromPreviousPage(), manga.getPageNum());
		}else if(window.location.href.indexOf("mode=manga") !== -1){
            manga.setPropatiesToNextPageManga(manga.getPropatiesFromPreviousPage());
		}
	});
})();
