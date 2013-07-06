/* global setDownloadAttribute */
/* global getPropatiesFromPreviousPage */
/* global setPropatiesToNextPage */
/* global getPropaties */

(function(){
	document.addEventListener('DOMContentLoaded', function(){
		if(window.location.href.indexOf("mode=medium") !== -1){
			setPropatiesToNextPage(getPropaties());
		}else if(window.location.href.indexOf("mode=big") !== -1){
			setDownloadAttribute(getPropatiesFromPreviousPage());
		}else if(window.location.href.indexOf("mode=manga") !== -1){
            appendScriptTag(createNewImagePathFunction(getPropatiesFromPreviousPage()));
		}else if(window.location.href.indexOf("mode=manga_big") !== -1){
		}
	});
})();
