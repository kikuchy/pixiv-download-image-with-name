/* global   getPropatiesFromPreviousPage,
            setPropatiesToNextPage,
            setPropatiesToNextPageManga,
            setDownloadLink,
            getPropaties,
            getPageNum */

(function(){
	document.addEventListener('DOMContentLoaded', function(){
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
