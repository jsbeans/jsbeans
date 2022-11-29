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
                   'java:java.util.Base64',],
		
		cachedContent: {},
		
		$constructor: function(){
		},

		get: function(params){
			var request = Web.getContext().getRequest();
			var response = Web.getContext().getResponse();
            response.setCharacterEncoding('UTF-8');
            response.setContentType('text');

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
                    // break when end of the line
                    if (c == NL) {
                        readLines++;
                        if (readLines == params.lines)
                            break;
                    }
                    builder["append(char)"](c);
                }
                // Since line is read from the last so it is in reverse order. Use reverse
                // method to make it correct order
                oStream.write(''+builder.reverse().toString());
            } finally {
                randomAccessFile && randomAccessFile.close();
            }
		},

	}
}