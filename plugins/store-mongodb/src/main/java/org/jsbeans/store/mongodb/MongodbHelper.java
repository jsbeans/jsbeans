package org.jsbeans.store.mongodb;

import com.mongodb.BasicDBList;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import org.bson.BSONObject;
import org.bson.types.BSONTimestamp;
import org.bson.types.ObjectId;
import org.jsbeans.serialization.GsonWrapper;
import org.jsbeans.serialization.JsObjectSerializerHelper;
import org.jsbeans.types.JsonArray;
import org.jsbeans.types.JsonObject;
import org.mozilla.javascript.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class MongodbHelper {
    private static Pattern timestampPtr = Pattern.compile("^\\s*new\\s+Timestamp\\s*\\((?:(\\d+),\\s*(\\d+)\\s*)?\\)\\s*$", 0);
    private static Pattern objectidPtr = Pattern.compile("^\\s*new\\s+ObjectId\\s*\\(([\"']?[A-Fa-f0-9]+[\"']?)?\\)\\s*$", 0);


    @SuppressWarnings("unchecked")
    public static Object toDBObject(Object obj) {
        if (obj == null) {
            return null;
        } else if (obj instanceof NativeObject || obj instanceof Map) {
            Map<Object,Object> json = (Map<Object,Object>) obj;

            /// move _id and timestamp on top
            ArrayList<String> keys = new ArrayList<>();
            BasicDBObject dbo = new BasicDBObject(json.size());
            for(Map.Entry<Object, Object> e : json.entrySet()) {
                String key = e.getKey().toString();
                Object value = e.getValue();

                if (key.equals("_id")) {
                    keys.add(0, key);
                } else if (value != null && value.equals("new Timestamp()")) {
                    if (keys.size() > 0 && keys.get(0).equals("_id")) {
                        keys.add(1, key);
                    } else {
                        keys.add(0, key);
                    }
                } else {
                    keys.add(key);
                }
            }

            for(String key : keys) {
                Object value = json.get(key);
                dbo.put(key, toDBObject(value));
            }
            return dbo;

        } else if (obj instanceof NativeArray || obj instanceof Iterable) {
            Iterable iterable = (Iterable) obj;
            BasicDBList list = new BasicDBList();
            for(Object a : iterable) {
                list.add(toDBObject(a));
            }
            return list;
        } else if (obj instanceof String) {
            String str = obj.toString();

            /// convert Timestamp
            Matcher mTimestamp = timestampPtr.matcher(str);
            if (mTimestamp.find()) {
                String strPar1 = mTimestamp.group(1);
                String strPar2 = mTimestamp.group(2);

                if (strPar1 != null && strPar2 != null) {
                    Integer par1 = Integer.parseInt(strPar1);
                    Integer par2 = Integer.parseInt(strPar2);

                    return new BSONTimestamp(par1, par2);
                }

                return new BSONTimestamp();
            }

            // convert ObjectId
            Matcher mObjectId = objectidPtr.matcher(str);
            if (mObjectId.find()) {
                String guid = mObjectId.group(1);
                if (guid != null) {
                    return new ObjectId(guid.replace("\"", "").replace("'", ""));
                }
                return new ObjectId();
            }

        }
        return obj;
    }


    public static Object toScriptable(Object obj, ScriptableObject scopeObject) {
        Context ctx = Context.enter();
        try {
            return toScriptable(obj, ctx, scopeObject.getParentScope());
        } finally {
            Context.exit();
        }

    }

    private static Object toScriptable(Object obj, Context ctx, Scriptable scope) {
        if (obj instanceof BSONObject) {
            BSONObject bson = (BSONObject) obj;
            return toScriptable(bson.toMap(), ctx, scope);
        } else if (obj instanceof Map) {
            Map<Object, Object> map = (Map<Object, Object>) obj;
            Scriptable result = ctx.newObject(scope);
            for (Map.Entry<?, ?> e : map.entrySet()) {
                result.put(
                        (String) e.getKey(),
                        result,
                        toScriptable(e.getValue(), ctx, scope)
                );
            }
            return result;
        } else if (obj instanceof Iterable) {
            Iterable iterable = (Iterable) obj;
            ArrayList<Object> list = new ArrayList<>();
            for(Object a : iterable) {
                list.add(toScriptable(a, ctx, scope));
            }

            Scriptable result = ctx.newArray(scope, list.toArray());
            return result;
        }
        return obj;
    }

}
