/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2016
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2016гг.
 */

package org.jsbeans.helpers;

import com.esotericsoftware.wildcard.Paths;
import org.jsbeans.PlatformException;
import org.jsbeans.Starter;

import java.io.*;
import java.nio.ByteBuffer;
import java.nio.charset.Charset;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.List;

public class FileHelper {
    private static FileHelper instance = new FileHelper();

    public static FileHelper getInstance() {
        return instance;
    }

    public static String readStringFromFile(String fName) throws IOException {
        byte[] encoded = Files.readAllBytes(java.nio.file.Paths.get(fName));
//        return new String(encoded);
        return Charset.forName("UTF-8").decode(ByteBuffer.wrap(encoded)).toString();
    }

    public static void writeStringToFile(String fName, String str) throws IOException {
//        byte[] encoded = Charset.forName("UTF-8").encode(str).array();
    	byte[] encoded = str.getBytes("UTF-8");
        Files.write(java.nio.file.Paths.get(fName), encoded, StandardOpenOption.CREATE, StandardOpenOption.WRITE, StandardOpenOption.TRUNCATE_EXISTING);
    }

    public static void appendStringToFile(String fName, String str) throws IOException {

        BufferedWriter bufWriter =
                Files.newBufferedWriter(
                        java.nio.file.Paths.get(fName),
                        Charset.forName("UTF8"),
                        StandardOpenOption.WRITE,
                        StandardOpenOption.APPEND,
                        StandardOpenOption.CREATE);
        PrintWriter out = new PrintWriter(bufWriter, true);

        out.println(str);

        //After done writing, remember to close!
        out.close();
        bufWriter.close();
    }

    public static boolean fileExists(String fName) {
        return new File(fName).exists();
    }

    public static String readStringFromResource(String path) throws PlatformException, IOException {
        String txtFile = "";
        InputStream iStream = Starter.class.getResourceAsStream(path);
        if (iStream == null) {
            throw new PlatformException(String.format("Unable to locate resource with path: '%s'", path));
        }
        BufferedReader bufRead = new BufferedReader(new InputStreamReader(iStream));
        while (true) {
            String line = bufRead.readLine();
            if (line != null) {
                txtFile += line + "\r\n";
            } else {
                break;
            }
        }

        return txtFile;
    }

    public static List<String> searchFiles(String base, String wildcardRegex) {
        return searchFiles(base, wildcardRegex, false);
    }

    public static List<String> searchFiles(String base, String wildcardRegex, boolean bRelative) {
        Paths paths = new Paths();
        paths.glob(base + "|" + wildcardRegex);
        if (bRelative) {
            return paths.getRelativePaths();
        }
        return paths.getPaths();
    }

    public static String getFolderByPath(String filePath) {
        int pos = Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\'));
        if (pos < 0) {
            return "/";
        }
        return filePath.substring(0, pos);
    }

    public static String getFileNameByPath(String filePath) {
        return filePath.substring(Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\')) + 1);
    }

    public static String normalizePath(String path) throws IOException {
        Path p = java.nio.file.Paths.get(path);
        return p.normalize().toString();
    }

    public static Path platformRelativePath(String dir) {
        Path p = FileSystems.getDefault().getPath(dir);
        if (!p.isAbsolute()) {
            p = java.nio.file.Paths.get(ConfigHelper.getRootFolder(), dir);
        }
        if (!p.toFile().exists()) {
            p.toFile().mkdirs();
        }
        return p.normalize();
    }

    public static Path pluginRelativePath(String dir, Object pluginsObject, boolean create) {
        return relativePath(dir, ConfigHelper.getPluginHomeFolder(pluginsObject), create);
    }

    public static Path relativePath(String dir, String base, boolean create) {
        Path p = FileSystems.getDefault().getPath(dir);
        if (!p.isAbsolute()) {
            p = java.nio.file.Paths.get(base, dir);
        }
        if (create && !p.toFile().exists()) {
            p.toFile().mkdirs();
        }
        return p.normalize();
    }

    public static void mkdirs(String dir) {
        Path p = FileSystems.getDefault().getPath(dir);
        if (!p.toFile().exists()) {
            p.toFile().mkdirs();
        }
    }

//    public static void rename(String oldDir, String newDir) throws IOException {
//        Path oldP = FileSystems.getDefault().getPath(oldDir);
//        Path newP = FileSystems.getDefault().getPath(newDir);
//        FileUtils.moveDirectory(oldP.toFile(), newP.toFile());
//    }


    public static void remove(String dir) {
        Path p = FileSystems.getDefault().getPath(dir);
        if (p.toFile().isDirectory()) {
            deleteDir(p.toFile());
        } else {
            p.toFile().delete();
        }
    }

    private static void deleteDir(File file) {
        File[] contents = file.listFiles();
        if (contents != null) {
            for (File f : contents) {
                deleteDir(f);
            }
        }
        file.delete();
    }
}
