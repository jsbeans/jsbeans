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
