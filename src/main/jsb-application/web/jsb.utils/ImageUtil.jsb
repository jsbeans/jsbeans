{
	$name: 'JSB.Utils.ImageUtil',
	$singleton: true,
	
	detectImagePrefix: function(arrBuf){
		var prefix = '';
		var u8a = new Uint8Array(arrBuf);
		var headerArr = u8a.subarray(0, 4);
		var header = "";
		for(var j = 0; j < headerArr.length; j++){
			header += headerArr[j].toString(16);
		}
		switch(header){
		case '89504e47':
			prefix = 'data:image/png;base64,';
	        break;
	    case '47494638':
	    	prefix = 'data:image/gif;base64,';
	        break;
	    case 'ffd8ffe0':
	    case 'ffd8ffe1':
	    case 'ffd8ffe2':
	    case 'ffd8ffe3':
	    case 'ffd8ffe8':
	    case '52494646':
	    	prefix = 'data:image/jpeg;base64,';
	        break;
	    case '3c3f786d':
	    case '3c737667':
	    	prefix = 'data:image/svg+xml;base64,';
	    	break;
	    default:
	        type = ""; // Or you can use the blob.type as fallback
	        break;
		}
		return prefix;
	},
		
	generateImageUrl: function(arrBuf){
		var prefix = '';
		if(JSB.isString(arrBuf)){
			if(arrBuf.indexOf('<svg') >= 0){
				prefix = 'data:image/svg+xml,';
				return prefix + encodeURIComponent(arrBuf);
			}
			var byteArr = JSB().Base64.decode(arrBuf);
			prefix = this.detectImagePrefix(byteArr);
			return prefix + arrBuf;
		} else if(JSB.isArrayBuffer(arrBuf)) {
			prefix = this.detectImagePrefix(arrBuf);
			return prefix + JSB().Base64.encode(arrBuf);
		} else {
			// TODO:
			debugger;
		}
	},
}