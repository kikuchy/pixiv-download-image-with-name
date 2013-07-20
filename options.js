var settings = {};
if(window.widget){
	if(widget.preferences) settings = widget.preferences;
}else{
	settings = localStorage;
}

var changeEventHandler = function(e){
	settings[this.name] = this.value;
};

var client = document.getElementById("client");
client.addEventListener('change', changeEventHandler, false);
client.addEventListener('keydown', changeEventHandler, false);
client.value = settings.client || "TwitterForMac";

var screenname = document.getElementById("screenname");
screenname.addEventListener("change", changeEventHandler, false);
screenname.addEventListener("keydown", changeEventHandler, false);
screenname.value = settings.screenname || "";
