package org.jsbeans.datacube;

import org.h2.tools.SimpleRowSource;

import java.sql.SQLException;

public class SimpleResultSet extends org.h2.tools.SimpleResultSet {

    public SimpleResultSet(SimpleRowSource source) {
        super(source);
    }

    @Override
    public boolean next() throws SQLException {
        return super.next();
    }
}
