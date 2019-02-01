package org.jsbeans.datacube;

import java.sql.Connection;
import java.sql.ResultSet;
import java.util.concurrent.Callable;
import java.util.concurrent.ConcurrentHashMap;

public class RemoteQueryIterator {

    public static ConcurrentHashMap<String, Object> RemoteIterators = new ConcurrentHashMap<>();

    /** Функция для вызова из H2 для получения результатов выполнения запроса
     * при вызове SQL выражения "... FROM DATACUBE('callback_uuid')"
     * */
    public static ResultSet datacube(Connection conn, String uid){
        Callable callback = (Callable)  RemoteIterators.get(uid);
        try {
            return (ResultSet) callback.call();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
