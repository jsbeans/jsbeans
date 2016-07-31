package org.jsbeans.messages;

public class AbstractMessage<T> implements ResponsibleMessage<T>, ReponseMessage<T>, Cloneable {
    private static final long serialVersionUID = -1L;

    private T response;
//	private Throwable error;

    @Override
    public T getResponse() {
        return response;
    }

//	@Override
//	public Throwable getError() {
//		return error;
//	}

    @Override
    public ReponseMessage<T> createResponse(T response) {
        AbstractMessage<T> resp = clone(this);
        resp.response = response;
        return resp;
    }

    @Override
    public ResponseError createError(Throwable error) {
        return new ResponseError(this, error);
    }

    @SuppressWarnings("unchecked")
    private AbstractMessage<T> clone(AbstractMessage<T> resp) {
        try {
            resp = (AbstractMessage<T>) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException("Can`t clone " + this.getClass().getName());
        }
        return resp;
    }

}
