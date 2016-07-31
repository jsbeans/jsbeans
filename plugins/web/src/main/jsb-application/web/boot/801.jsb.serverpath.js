var arrScripts = document.getElementsByTagName('script');
for(var i in arrScripts){
	var curSrc = arrScripts[i].src;
	var match = /(.*?)\/boot\?/gi.exec(curSrc);
	if(!JSB().isNull(match)){
		JSB().getProvider().setServerBase(match[1]);
		break;
	}
}