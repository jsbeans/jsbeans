/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

package org.jsbeans.helpers;

import java.util.ArrayList;

import org.mozilla.javascript.NativeArray;

public class ArrayHelper {
	public static Object[] toArray(NativeArray arr){
		ArrayList al = new ArrayList();
		for(int i = 0; i < arr.getLength(); i++){
			al.add(arr.get(i));
		}
		return al.toArray(new Object[0]);
	}
}