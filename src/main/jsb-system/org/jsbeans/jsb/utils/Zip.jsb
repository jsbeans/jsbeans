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
	               'java:java.util.zip.ZipEntry',
	               'java:java.util.zip.ZipOutputStream'
	               ],

	    zip: function(inputDescs, outputStream) {
	        var zOut = new ZipOutputStream(outputStream);

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

	    unzip: function() {
	        //
	    }
	}
}