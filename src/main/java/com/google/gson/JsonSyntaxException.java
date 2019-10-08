/*
 * Copyright (C) 2010 Google Inc.
 *
 * Licensed under the Apache Licence, Version 2.0 (the "Licence");
 * you may not use this file except in compliance with the Licence.
 * You may obtain a copy of the Licence at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the Licence is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the Licence for the specific language governing permissions and
 * limitations under the Licence.
 */
package com.google.gson;

/**
 * This exception is raised when Gson attempts to read (or write) a malformed
 * JSON element.
 *
 * @author Inderjeet Singh
 * @author Joel Leitch
 */
public final class JsonSyntaxException extends JsonParseException {

  private static final long serialVersionUID = 1L;

  public JsonSyntaxException(String msg) {
    super(msg);
  }

  public JsonSyntaxException(String msg, Throwable cause) {
    super(msg, cause);
  }

  /**
   * Creates exception with the specified cause. Consider using
   * {@link #JsonSyntaxException(String, Throwable)} instead if you can
   * describe what actually happened.
   *
   * @param cause root exception that caused this exception to be thrown.
   */
  public JsonSyntaxException(Throwable cause) {
    super(cause);
  }
}
