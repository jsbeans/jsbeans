package org.jsbeans.scripting;

import java.util.concurrent.locks.ReentrantLock;

public class LockEntry {
	private ReentrantLock _lock = new ReentrantLock();
	private int _count = 0;
	
	public void lock() {
		this._lock.lock();
	}
	
	public void reserve(){
		this._count++;
	}
	
	public void unlock() {
		this._count--;
		this._lock.unlock();
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