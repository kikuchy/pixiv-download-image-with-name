/* global setDownloadAttribute */
/* global getPropatiesFromPreviousPage */
/* global setPropatiesToNextPage */
/* global getPropaties */
/* global setDownloadAttributeManga */
/* global getPageNum */
/* global appendScriptTag */
/* global createNewImagePathFunction */

(function(){
	document.addEventListener('DOMContentLoaded', function(){
        var browser = chrome || opera;
		if(window.location.href.indexOf("mode=medium") !== -1){
			setPropatiesToNextPage(getPropaties());
		}else if(window.location.href.indexOf("mode=big") !== -1){
			setDownloadLink("illust", getPropatiesFromPreviousPage(), -1);
		}else if(window.location.href.indexOf("mode=manga_big") !== -1){
            setDownloadLink("manga", getPropatiesFromPreviousPage(), getPageNum());
		}else if(window.location.href.indexOf("mode=manga") !== -1){
            setPropatiesToNextPageManga(getPropatiesFromPreviousPage());
		}
	});
})();
