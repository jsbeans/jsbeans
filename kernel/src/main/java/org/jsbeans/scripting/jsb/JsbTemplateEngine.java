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
import org.jsbeans.helpers.ActorHelper;
import org.jsbeans.helpers.FileHelper;
import org.jsbeans.scripting.ExecuteScriptMessage;
import org.jsbeans.scripting.JsHub;
import org.jsbeans.scripting.UpdateStatusMessage;
import org.slf4j.LoggerFactory;
import scala.concurrent.Await;
import scala.concurrent.Future;

import java.io.IOException;
import java.util.regex.MatchResult;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class JsbTemplateEngine {

    public static String perform(String jsoBody, String jsoFile) throws Exception {
        String curJsoText = jsoBody;

        // perform imports
        curJsoText = performImports(curJsoText, jsoFile);

        // perform templates
        curJsoText = performDot(curJsoText, jsoFile);
        
        // perform multistrings
        curJsoText = performMultiString(curJsoText, jsoFile);
        
        return curJsoText;
    }
    
    private static String performMultiString(String jsoBody, String jsoFile){
    	Pattern p = Pattern.compile("`([^`]*)`", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.UNICODE_CASE);
        Matcher m = p.matcher(jsoBody);
        while (m.find()) {
            MatchResult mr = m.toMatchResult();
            String wholeStr = mr.group(0);
            String multiString = mr.group(1);
            int wStart = mr.start();
            int wEnd = wStart + wholeStr.length();
            
            // replace all commas
            multiString = multiString.replaceAll("\\\"", "\\\\\"");
            
            // replace newlines
            multiString = multiString.replaceAll("\\\r", "\\\\r");
            multiString = multiString.replaceAll("\\\n", "\\\\n");
            
            jsoBody = jsoBody.substring(0, wStart) + "\"" + multiString + "\"" + jsoBody.substring(wEnd);
            
            m.reset(jsoBody);
        }
        
    	return jsoBody;
    }

    private static String performImports(String jsoBody, String jsoFile) throws IOException {
        Pattern p = Pattern.compile("`\\#include\\s+([^`]+)`", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.UNICODE_CASE);
        Matcher m = p.matcher(jsoBody);
        while (m.find()) {
            MatchResult mr = m.toMatchResult();
            String includeFilePath = mr.group(1).trim();
            String folderPath = FileHelper.getFolderByPath(jsoFile);
            String incPath = FileHelper.normalizePath(folderPath + "/" + includeFilePath);
            String fileBody = FileHelper.readStringFromFile(incPath);
            // replace found
            if (fileBody == null) {
                fileBody = "";
            }
            jsoBody = jsoBody.substring(0, mr.start()) + fileBody + jsoBody.substring(mr.end());

            m.reset(jsoBody);
        }

        return jsoBody;
    }

    private static String performDot(String jsoBody, String jsoFile) throws Exception {
        Pattern p = Pattern.compile("`\\#dot\\s*([^`]*)`", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.UNICODE_CASE);
        Matcher m = p.matcher(jsoBody);
        while (m.find()) {
            MatchResult mr = m.toMatchResult();
            String wholeStr = mr.group(0);
            String templateBody = mr.group(1);
            int wStart = mr.start();
            int wEnd = wStart + wholeStr.length();

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

            // do replace
            String repStr = String.format("%s.call(this, this)", usMsg.result.toJS(false));
            jsoBody = jsoBody.substring(0, wStart) + repStr + jsoBody.substring(wEnd);
            m.reset(jsoBody);
        }

        return jsoBody;
    }
}
