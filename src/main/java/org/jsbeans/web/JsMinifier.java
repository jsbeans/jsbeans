/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

package org.jsbeans.web;

import com.google.javascript.jscomp.CompilationLevel;
import com.google.javascript.jscomp.CompilerOptions;
import com.google.javascript.jscomp.CompilerOptions.LanguageMode;
import com.google.javascript.jscomp.Result;
import com.google.javascript.jscomp.SourceFile;
import com.google.javascript.jscomp.parsing.parser.FeatureSet;

import java.io.IOException;

public class JsMinifier {

    public static String minify(String src, boolean bPrepare) throws IOException {
        String prefixComment = "";
        CompilerOptions options = new CompilerOptions();
        CompilationLevel.WHITESPACE_ONLY.setOptionsForCompilationLevel(options);
        options.setLanguageIn(LanguageMode.ECMASCRIPT5);
        
        if (src.startsWith("/*")) {
            int endCommentPos = src.indexOf("*/");
            prefixComment = src.substring(0, endCommentPos + 2);
        }
        if (bPrepare) {
            src = "var a = " + src + ";";
        }
        com.google.javascript.jscomp.Compiler compiler = new com.google.javascript.jscomp.Compiler();
        Result result = compiler.compile(SourceFile.fromCode("externs", ""), SourceFile.fromCode("input", src), options);
        if (result.success) {
            String rr = compiler.toSource();
            if (bPrepare) {
                int firstIdx = rr.indexOf('=');
                rr = rr.substring(firstIdx + 1, rr.length() - 1);
            }
            return prefixComment + rr;
        }

        throw new IllegalArgumentException("Unable to minify input source");
    }
}
