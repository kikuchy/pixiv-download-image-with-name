"use strict";

(function(){
    var cmUtil = require("./functions");
	document.addEventListener("DOMContentLoaded", function(){
		if(window.location.href.indexOf("mode=medium") !== -1){
			cmUtil.setPropatiesToNextPage(cmUtil.getPropaties());
		}else if(window.location.href.indexOf("mode=big") !== -1){
			cmUtil.setDownloadLink("illust", cmUtil.getPropatiesFromPreviousPage(), -1);
		}else if(window.location.href.indexOf("mode=manga_big") !== -1){
            cmUtil.setDownloadLink("manga", cmUtil.getPropatiesFromPreviousPage(), cmUtil.getPageNum());
		}else if(window.location.href.indexOf("mode=manga") !== -1){
            cmUtil.setPropatiesToNextPageManga(cmUtil.getPropatiesFromPreviousPage());
		}
	});
})();
