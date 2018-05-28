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
