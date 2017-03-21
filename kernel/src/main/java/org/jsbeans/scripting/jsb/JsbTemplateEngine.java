/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2016
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2016гг.
 */

package org.jsbeans.scripting.jsb;

import akka.util.Timeout;

import org.jsbeans.PlatformException;
import org.jsbeans.helpers.ActorHelper;
import org.jsbeans.helpers.FileHelper;
import org.jsbeans.scripting.ExecuteScriptMessage;
import org.jsbeans.scripting.JsHub;
import org.jsbeans.scripting.UpdateStatusMessage;
import org.slf4j.LoggerFactory;
import scala.concurrent.Await;
import scala.concurrent.Future;

import java.util.regex.MatchResult;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class JsbTemplateEngine {

    public static String perform(String script, String jsoFile) throws Exception {
        for(int curPos = 0; curPos < script.length(); ){
        	if(curPos < script.length() - 1 
        		&& script.charAt(curPos) == '/' && script.charAt(curPos + 1) == '*'
        		&& (curPos == 0 || script.charAt(curPos - 1) != '\\')){
        		
        		// perform multi-line comment 
        		int endCommentPos = script.indexOf("*/", curPos + 2);
        		if(endCommentPos == -1){
        			endCommentPos = script.length();
        		}
        		curPos = endCommentPos + 2;
        		continue;
        	} else if(curPos < script.length() - 1 
        		&& script.charAt(curPos) == '/' && script.charAt(curPos + 1) == '/'
        		&& (curPos == 0 || script.charAt(curPos - 1) != '\\')){
        		
        		// perform single-line comment
        		int endCommentPos = script.indexOf('\n', curPos + 2);
        		if(endCommentPos == -1){
        			endCommentPos = script.length();
        		}
        		curPos = endCommentPos + 1;
        		continue;
        	} else if((script.charAt(curPos) == '\"' || script.charAt(curPos) == '\'')
        			&& (curPos == 0 || script.charAt(curPos - 1) != '\\')){
        		char comma = script.charAt(curPos);
        		
        		// perform string value
        		int endLinePos = script.indexOf('\n', curPos + 1);
        		if(endLinePos == -1){
        			endLinePos = script.length();
        		}
        		int endStringPos = -1;
        		for(int cPos = curPos + 1; cPos < endLinePos; cPos++){
        			if(script.charAt(cPos) == comma && (cPos == curPos + 1 || script.charAt(cPos - 1) != '\\')){
        				endStringPos = cPos;
        				break;
        			}
        		}
        		if(endStringPos == -1){
        			endStringPos = endLinePos;
        		}
        		curPos = endStringPos + 1;
        		continue;
        	} else if(script.charAt(curPos) == '`'){
        		int endSpecificPos = script.indexOf('`', curPos + 1);
        		if(endSpecificPos == -1){
        			endSpecificPos = script.length();
        		}
        		String specificText = script.substring(curPos + 1, endSpecificPos);
        		String newSpecificText = performSpecific(specificText, jsoFile);
        		String newScript = script.substring(0, curPos) + newSpecificText;
        		if(endSpecificPos < script.length()){
        			newScript += script.substring(endSpecificPos + 1);
        		}
        		script = newScript;
        		curPos += newSpecificText.length() + 1;
        		continue;
        	}
        	
        	curPos++;
        }
        
        return script;
    }
    
    private static String performSpecific(String text, String jsoFile) throws Exception{
    	String newText = "";
    	if(text.length() > 0 && text.charAt(0) == '#'){
    		Pattern p = Pattern.compile("\\#(\\w+)", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE);
    		Matcher m = p.matcher(text);
    		if(m.find()){
    			MatchResult mr = m.toMatchResult();
    			String templateOp = mr.group(1);
    			if("dot".compareToIgnoreCase(templateOp) == 0){
    				String templateBody = text.substring(4);
    				
    	            // call JsHub
    	            ExecuteScriptMessage execMsg = new ExecuteScriptMessage("var t = '' + this.template; Template.doT.template(t);", false);
    	            execMsg.addWrapped("template", templateBody);
    	            Timeout timeout = ActorHelper.getServiceCommTimeout();

    	            Future<Object> future = ActorHelper.futureAsk(ActorHelper.getActorSelection(JsHub.class), execMsg, timeout);
    	            UpdateStatusMessage usMsg = (UpdateStatusMessage) Await.result(future, timeout.duration());

    	            if (usMsg.result == null) {
    	                LoggerFactory.getLogger(JsbTemplateEngine.class).error("Error occured due to expanding doT template in file: '{}'; templateBody: {}; error: {}", jsoFile, templateBody, usMsg.error);
    	                return "";
    	            }

    	            newText = String.format("%s.call(this, this)", usMsg.result.toJS(false));

    			} else if("include".compareToIgnoreCase(templateOp) == 0){
    				Pattern p2 = Pattern.compile("\\#include\\s+[\\'\\\"]([^\\'\\\"]+)[\\'\\\"]", Pattern.CASE_INSENSITIVE | Pattern.UNICODE_CASE);
    		        Matcher m2 = p2.matcher(text);
    		        if(m2.find()){
    		        	MatchResult mr2 = m2.toMatchResult();
    		            String includeFilePath = mr2.group(1).trim();
    		            String folderPath = FileHelper.getFolderByPath(jsoFile);
    		            String incPath = FileHelper.normalizePath(folderPath + "/" + includeFilePath);
    		            newText = FileHelper.readStringFromFile(incPath);
    		            // replace found
    		            if (newText == null) {
    		            	newText = "";
    		            }
    		        } else {
    		        	throw new PlatformException("Invalid #include syntax");
    		        }
    			} else {
    				throw new PlatformException("Invalid template option: " + templateOp);
    			}
    		} else {
    			throw new PlatformException("Invalid template syntax");
    		}
    	} else {
    		// perform multi-line string
    		
    		// replace all commas
    		newText = text.replaceAll("\\\"", "\\\\\"");
            
            // replace newlines
    		newText = newText.replaceAll("\\\r", "\\\\r");
    		newText = newText.replaceAll("\\\n", "\\\\n");
    		
    		newText = "\"" + newText + "\"";
    	}
    	
    	return newText;
    }
}
