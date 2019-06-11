/*
 * This file is the part of jsBeans, high-level JavaScript client-server framework.
 * The contents of this file are subject to the MIT License (MIT).
 * (c) aa@sis.ru, da@sis.ru, Special Information Systems, LLC, 2011-2019
 *
 * Настоящий файл является частью клиент-сервеной JavaScript платформы.
 * Условия использования и распространения содержимого данного файла соответствуют программному обеспечению с открытыми исходными кодами и равнозначно MIT License (MIT).
 * Авторские права принадлежат aa@sis.ru, da@sis.ru, ООО СИС, 2011-2019гг.
 */

package org.jsbeans.web;

import java.io.IOException;
import java.io.InputStream;

import javax.servlet.AsyncContext;

public class UploadStream extends InputStream {
	private AsyncContext ac = null;
	private InputStream is = null;
	
	public UploadStream(AsyncContext ac, InputStream is) {
		this.ac = ac;
		this.is = is;
	}
	
	@Override
	public int read() throws IOException {
		int res = this.is.read();
		if(res == -1) {
			if(this.ac != null) {
				this.ac.complete();
				this.ac = null;
			}
		}
		return res;
	}
	
	@Override
	public int read(byte[] bArr) throws IOException {
		int res = this.is.read(bArr);
		if(res == -1) {
			if(this.ac != null) {
				this.ac.complete();
				this.ac = null;
			}
		}
		return res;
	}
	
	@Override
	public int read(byte[] bArr, int off, int len) throws IOException {
		int res = this.is.read(bArr, off, len);
		if(res == -1) {
			if(this.ac != null) {
				this.ac.complete();
				this.ac = null;
			}
		}
		return res;
	}
	
	@Override
	public void close() throws IOException {
		try {
			this.is.close();
		} catch(Exception e) {}
		if(this.ac != null) {
			this.ac.complete();
			this.ac = null;
		}
	}

}
