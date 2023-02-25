/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

{
	$name: 'JSB.JsbLogTailer',
	$http: true,
	$fixedId: true,
	$singleton: true,

	$server: {
		$require: ['java:java.io.File',
		            'java:java.lang.Thread',
		           'java:java.io.PrintWriter',
		           'java:java.io.FileInputStream',
		           'java:java.io.RandomAccessFile',
                    'java:java.lang.StringBuilder',
		           'JSB.System.Config',
		           'JSB.System.Kernel',
		           'JSB.Auth',
                   'JSB.Web',
                   'JSB.IO.TextStream',
                   'java:java.util.Base64',
                   {JString: 'java:java.lang.String'},
                   ],

		cachedContent: {},
		
		$constructor: function(){
		},

		get: function(params){
		    params.readEncoding = params && params.readEncoding || "ISO-8859-1";
			var request = Web.getContext().getRequest();
			var response = Web.getContext().getResponse();
            response.setCharacterEncoding('UTF-8');
            response.setContentType('text/html; charset=utf-8');

            Kernel.checkSystemOrAdmin();

            var logPath = Config.get('kernel.log.file');
            var lines = Config.get('kernel.log.lines');

            var file = new File(logPath);
            var oStream = new TextStream(response.getOutputStream(), {charset: 'UTF-8'});
            try {
                params.lines = parseInt(params.lines||50);
                var NL = 10;
                var readLines = 0;
                var builder = new StringBuilder();

                var randomAccessFile = new RandomAccessFile(file, 'r');
                var fileLength = file.length() - 1;
                randomAccessFile.seek(fileLength);

                for (var pointer = fileLength; pointer >= 0; pointer--) {
                    randomAccessFile.seek(pointer);
                    var c;
                    // read from the last, one char at the time
                    c = randomAccessFile.read();
                    if (c == NL) {
                        readLines++;
                        if (readLines == params.lines)
                            break;
                    }
                }

                oStream.write('<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head><body><div style="white-space:pre">');
                randomAccessFile.seek(pointer > 0 ? pointer : 0);
                for(var i =0; ;i++){
                    var line = randomAccessFile.readLine();
                    if(!line) break;
                    var str = new JString(line.getBytes(params.readEncoding),"UTF-8");
                    oStream.writeLine(''+str);
                }
                oStream.write('</div></body></html>');
            } finally {
                randomAccessFile && randomAccessFile.close();
            }
		},

	}
}