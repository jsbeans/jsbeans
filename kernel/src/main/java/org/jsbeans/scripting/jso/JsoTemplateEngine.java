package org.jsbeans.scripting.jso;

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

import java.io.IOException;
import java.util.regex.MatchResult;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class JsoTemplateEngine {

    public static String perform(String jsoBody, String jsoFile) throws Exception {
        String curJsoText = jsoBody;

        // perform imports
        curJsoText = performImports(curJsoText, jsoFile);

        curJsoText = performDot(curJsoText, jsoFile);

        return curJsoText;
    }

    private static String performImports(String jsoBody, String jsoFile) throws IOException {
        Pattern p = Pattern.compile("\\#include\\s+[\\\"\\\']([^\\\"\\\']+)[\\\"\\\']", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.UNICODE_CASE);
        Matcher m = p.matcher(jsoBody);
        while (m.find()) {
            MatchResult mr = m.toMatchResult();
            String includeFilePath = mr.group(1);
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
        Pattern p = Pattern.compile("\\#dot\\s*(\\{\\{)", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.UNICODE_CASE);
        Matcher m = p.matcher(jsoBody);
        while (m.find()) {
            MatchResult mr = m.toMatchResult();
            int tStart = mr.start(1);

            // looking for end of template
            int curPos = tStart + 2;
            int deep = 1;
            while (true) {
                int nextOpen = jsoBody.indexOf("{{", curPos);
                int nextClose = jsoBody.indexOf("}}", curPos);
                if (nextOpen == -1 && nextClose == -1) {
                    throw new PlatformException("Template is not closing in " + jsoFile + "(" + tStart + ")");
                }
                if (nextOpen >= 0 && (nextOpen < nextClose || nextClose == -1)) {
                    deep++;
                    curPos = nextOpen + 2;
                    continue;
                }
                if (nextClose >= 0 && (nextClose < nextOpen || nextOpen == -1)) {
                    deep--;
                    curPos = nextClose + 2;
                    if (deep == 0) {
                        break;
                    }
                    continue;
                }
            }

            String templateBody = jsoBody.substring(tStart + 2, curPos - 2);

            // call JsHub
            ExecuteScriptMessage execMsg = new ExecuteScriptMessage("var t = '' + this.template; Template.doT.template(t);", false);
            execMsg.addWrapped("template", templateBody);
            Timeout timeout = ActorHelper.getServiceCommTimeout();

            Future<Object> future = ActorHelper.futureAsk(ActorHelper.getActorSelection(JsHub.class), execMsg, timeout);
            UpdateStatusMessage usMsg = (UpdateStatusMessage) Await.result(future, timeout.duration());

            if (usMsg.result == null) {
                LoggerFactory.getLogger(JsoTemplateEngine.class).error("Error occured due to expanding doT template in file: '{}'; templateBody: {}; error: {}", jsoFile, templateBody, usMsg.error);
                return "";
            }

            // do replace
            String repStr = String.format("%s.call(this, this)", usMsg.result.toJS(false));
            jsoBody = jsoBody.substring(0, mr.start()) + repStr + jsoBody.substring(curPos);
            m.reset(jsoBody);
        }

        return jsoBody;
    }
}
