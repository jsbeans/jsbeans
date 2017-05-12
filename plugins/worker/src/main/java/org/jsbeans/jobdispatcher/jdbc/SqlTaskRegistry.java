package org.jsbeans.jobdispatcher.jdbc;

import org.jsbeans.jobdispatcher.base.BaseTaskRegistry;

import java.util.Properties;

public class SqlTaskRegistry extends BaseTaskRegistry<SqlTaskCollection> {

    private final String jdbcURL;
    private final Properties props;
    private final SqlTaskCollection.SQLConfig sqlConfig;

    public SqlTaskRegistry(String jdbcURL, Properties props){
        this(jdbcURL, props, null);
    }

    public SqlTaskRegistry(String jdbcURL, Properties props, SqlTaskCollection.SQLConfig sqlConfig){
        this.jdbcURL = jdbcURL;
        this.props = props;
        this.sqlConfig = sqlConfig;
        init();
    }

    @Override
    protected SqlTaskCollection createFileTaskCollection(State state) {
        return new SqlTaskCollection(jdbcURL, props, sqlConfig);
    }
}
