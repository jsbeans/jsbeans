/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT Licence (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT Licence (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

package org.jsbeans.scripting;

public class LockStatEntry {
	private String _lockName;
	private boolean _isLocked;
	private int _queueLength;
	private String _stack;
	
	public LockStatEntry(String lockName, boolean isLocked, int queueLength, String stack){
		this._lockName = lockName;
		this. _isLocked = isLocked;
		this._queueLength = queueLength;
		this._stack = stack;
	}
	
	public String getLockName(){
		return this._lockName;
	}
	
	public boolean isLocked(){
		return this._isLocked;
	}
	
	public int getQueueLength(){
		return this._queueLength;
	}
	
	public String getStack() {
		return this._stack;
	}
}
