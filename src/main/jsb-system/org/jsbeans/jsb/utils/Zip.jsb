/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-серверной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2021гг.
 */

{
	$name: 'JSB.Utils.Zip',

	$singleton: true,

	$server: {
	    $require: ['JSB.IO.FileSystem',
	               'java:java.lang.reflect.Array',
	               'java:java.lang.Byte',
	               'java:java.nio.charset.StandardCharsets',
	               'java:java.io.File',
	               'java:java.io.FileOutputStream',
	               'java:java.util.zip.ZipEntry',
	               'java:java.util.zip.ZipOutputStream',
	               'java:java.util.zip.ZipInputStream',
	               'java:org.jsbeans.helpers.BufferHelper',
	               'java:java.nio.file.Paths'
	               ],

	    zip: function(inputDescs, outputStream) {
	        var zOut = new ZipOutputStream(outputStream, StandardCharsets.UTF_8);

	        inputDescs.forEach(desc => {
	            let entry = new ZipEntry(desc.relPath),
	                buffer = Array.newInstance(Byte.TYPE, FileSystem.size(desc.path)),
	                stream = FileSystem.open(desc.path);

	            zOut.putNextEntry(entry);

	            stream.read(buffer);

	            zOut.write(buffer);

	            stream.close();

	            zOut.closeEntry();
	        });

	        zOut.close();
	    },

	    unzip: function(fileStream, outputDir) {
	        var zIn = new ZipInputStream(fileStream, StandardCharsets.UTF_8),
	            entry = zIn.getNextEntry(),
	            chunkSize = 2048;

	        var bArr = BufferHelper.allocateByteArray(chunkSize);
            while(entry) {
            	var outPath = outputDir;
            	var entryParts = ('' + entry.getName()).split(/[\\\/]/i);
            	for(var i = 0; i < entryParts.length; i++){
            		outPath = FileSystem.join(outPath, entryParts[i]);
            	}
                var file = new File(outPath);
/*            	JSB.getLogger().info('Unzipping: "' + file.getPath() + '"'); */
                file.getParentFile().mkdirs();
                var fOut = new FileOutputStream(file);
                while(true) {
                	var rc = zIn.read(bArr, 0, chunkSize);
                	if(rc > 0){
                		fOut.write(bArr, 0, rc);	
                	} else {
                		break;
                	}
                }

                fOut.flush();

                fOut.close();

                zIn.closeEntry();

                entry = zIn.getNextEntry();
            }

            zIn.close();
	    }
	}
}