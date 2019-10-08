/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

package org.jsbeans.documentation;

import org.jsbeans.helpers.ConfigHelper;
import org.jsbeans.types.JsonArray;
import org.jsbeans.types.JsonObject;
import org.jsbeans.helpers.FileHelper;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class JsbDoc {
    private static String MARKER_START = "/**";
    private static String MARKER_START_SKIP = "/***";
    private static String MARKER_END = "*/";

    private static JsonArray chunk = null;

    // public API
    public static void parse(String source, String fileName){
        try {
            JsonArray result = new JsonArray();
            String[] lines = source.split("\\n");

            for (int i = 0; i < lines.length; i++) {
                JsonObject block = extract(lines[i], i);

                if (block != null) {
                    /*
                    JsonObject target;
                    do{
                        i++;
                        target = parse_target(lines[i]);
                    } while (target == null);

                    result.add(merge(block, target));
                    */
                    result.add(block);
                }
            }

            if(result.size() > 0){
                FileHelper.writeStringToFile(ConfigHelper.getConfigString("kernel.jsb.docPath") + "/" + fileName, result.toString());
            }
        } catch (Throwable ex){
        } finally {
            chunk = null;
        }
    }

    private static JsonObject extract(String line, int number){
        JsonObject result = null;
        int startPos = line.indexOf(MARKER_START),
            endPos = line.indexOf(MARKER_END),
            indent = 0;

        if (startPos != -1 && line.indexOf(MARKER_START_SKIP) != startPos) {
            chunk = new JsonArray();
            indent = startPos + MARKER_START.length();
        }

        if(chunk != null){
            int lineStart = indent;
            boolean startWithStar = false;

            Pattern p = Pattern.compile("\\S");
            Matcher m = p.matcher(line);
            boolean nonSpaceChar = m.find();

            if(chunk.size() > 0 && nonSpaceChar){
                String nonSpaceCharSymbol = m.group();
                int nonSpaceCharIndex = m.start();

                if((int)nonSpaceCharSymbol.charAt(0) == 42 && endPos == -1){
                    lineStart = nonSpaceCharIndex + 2;
                    startWithStar = true;
                } else if(nonSpaceCharIndex < indent){
                    lineStart = nonSpaceCharIndex;
                }
            }

            JsonObject ch = new JsonObject();
            ch.put("number", number);
            ch.put("startWithStar", startWithStar);
            ch.put("source", line.substring(lineStart, endPos == -1 ? line.length() : endPos));

            chunk.add(ch);

            if(endPos != -1){
                result = parse_block();
                chunk = null;
            }
        }

        return result;
    }

    private static JsonObject parse_block(){
        JsonArray source = new JsonArray();

        for(int i = 0; i < chunk.size(); i++){
            JsonObject line = (JsonObject) chunk.getElement(i);
            String sourceString = (String) line.get("source");

            sourceString.trim();

            Pattern p = Pattern.compile("^ *@(\\w+)");
            Matcher m = p.matcher(sourceString);

            if(m.find()){
                JsonObject ob = new JsonObject();
                ob.put("source", sourceString);
                ob.put("line", line.get("number"));

                source.add(ob);
            } else {
                if(source.size() - 1 < 0){
                    JsonObject tag = new JsonObject();
                    tag.put("source", sourceString);
                    source.add(tag);
                } else {
                    JsonObject tag = (JsonObject) source.get(source.size() - 1);
                    String lastTagSource = tag.get("source");
                    lastTagSource += sourceString;
                    tag.put("source", lastTagSource);
                    source.set(source.size() - 1, tag);
                }
            }
        }

        JsonObject description = (JsonObject) source.get(0);
        source.remove(0);

        if(description.get("source") == "" && source.size() == 0){
            return null;
        }

        JsonArray tags = new JsonArray();

        for(int i = 0; i < source.size(); i++){
            JsonObject s = (JsonObject) source.get(i);
            JsonObject tag_node = parse_string(s.get("source"));

            if(tag_node == null){
                tag_node.put("line", s.get("line"));
                tag_node.put("source", s.get("source"));
            }

            tags.add(tag_node);
        }

        JsonObject result = new JsonObject();
        result.put("tags", tags);
        result.put("line", ((JsonObject) chunk.get(0)).get("number"));
        result.put("description", ((String)description.get("source")).trim());
        result.put("source", source);

        return result;
    }

    private static JsonObject parse_string(String str){
        JsonObject data = new JsonObject();
        boolean errors = false;

        try{
            JsonObject res = parse_tag(str);

            if(res != null){
                String s = res.get("source");
                str = str.substring(s.length());
                data = merge(data, (JsonObject) res.get("data"));
            }
        } catch (Error ex){
            errors = true;
        }

        if(!errors){
            try{
                JsonObject res = parse_type(str);

                if(res != null){
                    String s = res.get("source");
                    str = str.substring(s.length());
                    data = merge(data, (JsonObject) res.get("data"));
                }
            } catch (Error e){
                errors = true;
            }
        }

        if(!errors){
            try{
                JsonObject res = parse_name(str);

                if(res != null){
                    String s = res.get("source");
                    str = str.substring(s.length());
                    data = merge(data, (JsonObject) res.get("data"));
                }
            } catch (Error e){
                errors = true;
            }
        }


        if(!errors){
            try{
                JsonObject res = parse_description(str);

                if(res != null){
                    data = merge(data, (JsonObject) res.get("data"));
                }
            } catch (Error e){
                errors = true;
            }
        }

        return data;
    }

    // parsers
    private static JsonObject parse_tag(String str){
        Pattern p = Pattern.compile("^\\S*@(\\S+)");
        Matcher m = p.matcher(str);

        if(!m.find()){
            throw new Error("Invalid `@tag`, missing @ symbol");
        }

        JsonObject data = new JsonObject();
        data.put("tag", m.group(1));

        JsonObject res = new JsonObject();
        res.put("source", m.group());
        res.put("data", data);

        return res;
    }

    private static JsonObject parse_type(String str){
        int pos = skipws(str),
            brackets = 0;
        String res = "";

        if((int)str.substring(pos, pos + 1).charAt(0) != 123){
            return null;
        }

        while(pos < str.length()){
            brackets += (int)str.substring(pos, pos + 1).charAt(0) == 123 ? 1 : (int)str.substring(pos, pos + 1).charAt(0) == 125 ? -1 : 0;
            res += str.substring(pos, pos + 1);
            pos++;

            if(brackets == 0){
                break;
            }
        }

        if(brackets != 0){
            throw new Error("Invalid `{type}`, unpaired brackets");
        }

        JsonObject data = new JsonObject();
        data.put("type", res.substring(1, res.length() - 1));

        JsonObject result = new JsonObject();
        result.put("source", str.substring(0, pos));
        result.put("data", data);

        return result;
    }

    private static JsonObject parse_name(String str){
        int pos = skipws(str),
            brackets = 0;
        String name = "";

        Pattern p = Pattern.compile("\\s");
        Matcher m;

        while (pos < str.length()){
            String substr = str.substring(pos, pos + 1);
            brackets += (int)substr.charAt(0) == 91 ? 1 : (int)substr.charAt(0) == 93 ? -1 : 0;
            name += substr;
            pos++;

            m = p.matcher(substr);
            if(brackets == 0 && m.find()){
                break;
            }
        }

        if(brackets != 0){
            throw new Error("Invalid `name`, unpaired brackets");
        }

        JsonObject res = new JsonObject();
        res.put("optional", false);

        if (name.substring(0, 1).charAt(0) == 91 && name.substring(name.length() - 1, name.length() - 1).charAt(0) == 93) {
            res.put("optional", true);
            name = name.substring(1, name.length() - 2);

            if(name.indexOf('=') != -1){
                String parts[] = name.split("=");
                name = parts[0];

                Pattern pat = Pattern.compile("");
                m = pat.matcher(parts[1]);
                res.put("default", m.replaceFirst("$2"));
            }
        }

        res.put("name", name.trim());

        JsonObject data = new JsonObject();
        data.put("source", str.substring(0, pos));
        data.put("data", res);

        return data;
    }

    private static JsonObject parse_description(String str){
        Pattern p = Pattern.compile("^\\S+((.|\\s)+)?");
        Matcher m = p.matcher(str);

        if(m.find()){
            JsonObject data = new JsonObject();
            data.put("description", m.group(0).trim());

            JsonObject res = new JsonObject();
            res.put("data", data);

            return res;
        }

        return null;
    }

    private static JsonObject parse_target(String str){
        str = str.trim();
        Pattern p = Pattern.compile("\\S");
        Matcher m = p.matcher(str);

        if(m.find()){
            JsonObject res = new JsonObject();
            res.put("targetType", str.indexOf("function") > -1 ? "function" : "variable");
            res.put("targetName", str.substring(0, str.indexOf(":")));
            return res;
        }

        return null;
    }

    // utils
    private static JsonObject merge(JsonObject... args){
        if(args.length == 1){
            return args[0];
        }

        JsonObject res = args[0];

        for(int i = 1; i < args.length; i++){
            if(args[i] == null){
                continue;
            }

            String[] keys = args[i].getProperties().toArray(new String[args[i].getProperties().size()]);

            for(int j = 0; j < keys.length; j++){
                res.put(keys[j], args[i].get(keys[j]));
            }
        }

        return res;
    }

    private static int skipws(String str){
        Pattern p = Pattern.compile("\\S");
        Matcher m = p.matcher(str);

        if(m.find()){
            return m.start();
        } else {
            return 0;
        }
    }
}