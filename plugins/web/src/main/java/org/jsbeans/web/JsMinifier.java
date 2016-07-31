package org.jsbeans.web;

import com.google.javascript.jscomp.CompilationLevel;
import com.google.javascript.jscomp.CompilerOptions;
import com.google.javascript.jscomp.CompilerOptions.LanguageMode;
import com.google.javascript.jscomp.Result;
import com.google.javascript.jscomp.SourceFile;

import java.io.IOException;

public class JsMinifier {

    public static String minify(String src, boolean bPrepare) throws IOException {
        String prefixComment = "";
        CompilerOptions options = new CompilerOptions();
        CompilationLevel.SIMPLE_OPTIMIZATIONS.setOptionsForCompilationLevel(options);
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
