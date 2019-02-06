package org.jsbeans.datacube;

import java.sql.Connection;
import java.sql.ResultSet;
import java.util.concurrent.Callable;
import java.util.concurrent.ConcurrentHashMap;

public class RemoteQueryIterator {

    public static ConcurrentHashMap<String, Callable<ResultSet>> RemoteIterators = new ConcurrentHashMap<>();

    /** Функция для вызова из H2 для получения результатов выполнения запроса
     * при вызове SQL выражения "... FROM DATACUBE('callback_uuid')"
     * */
    public static ResultSet datacube(Connection conn, String uid, Object cond){
        Callable<ResultSet> callback = RemoteIterators.get(uid);
        try {
            ResultSet rs = callback.call();
            return rs;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
