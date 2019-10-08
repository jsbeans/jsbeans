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

import java.util.concurrent.locks.ReentrantLock;

public class LockEntry {
	private ReentrantLock _lock = new ReentrantLock();
	private int _count = 0;
	
	public void lock() {
		this._lock.lock();
	}
	
	public void reserve(){
		synchronized(this){
			this._count++;
		}
	}
	
	public void unlock() {
		try {
			this._lock.unlock();
		} catch(Exception e){}
		synchronized(this){
			this._count--;
		}
	}
	
	public ReentrantLock getLock() {
		return this._lock;
	}
	
	public int getLocks() {
		return this._count;
	}
	
	public boolean canRemove() {
		return this.getLocks() == 0;
	}
}
