var settings = {};
if(window.widget){
	if(widget.preferences) settings = widget.preferences;
}else{
	settings = localStorage;
}

var changeEventHandler = function(e){
	settings[this.name] = this.value;
};

var illustname = document.getElementById("illustname");
illustname.addEventListener('change', changeEventHandler, false);
illustname.addEventListener('keydown', changeEventHandler, false);
illustname.value = settings.illustname || "{illustTitle} - {userName} - {illustId}";

var manganame = document.getElementById("manganame");
manganame.addEventListener("change", changeEventHandler, false);
manganame.addEventListener("keydown", changeEventHandler, false);
manganame.value = settings.manganame || "{illustTitle} - {userName} - {illustId}_{page}";
