package org.jsbeans.jobdispatcher.jdbc;

import org.jsbeans.jobdispatcher.TaskDescriptor;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Iterator;

public class TaskResultSetIterator implements Iterator<TaskDescriptor> {

    private ResultSet rs;
    private PreparedStatement ps;
    private Connection connection;
    private boolean closeConnection;
    private SqlTaskCollection.SQLConfig sqlConfig;

    public TaskResultSetIterator(Connection connection, boolean closeConnection, SqlTaskCollection.SQLConfig sqlConfig) {
        this.connection = connection;
        this.closeConnection = closeConnection;
        this.sqlConfig = sqlConfig;
    }

    public void init() {
        try {
            ps = connection.prepareStatement(sqlConfig.getSelectTaskQuery());
            rs = ps.executeQuery();

        } catch (SQLException e) {
            close();
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean hasNext() {
        if (ps == null) {
            init();
        }
        try {
            boolean hasMore = rs.next();
            if (!hasMore) {
                close();
            }
            return hasMore;
        } catch (SQLException e) {
            close();
            throw new RuntimeException(e);
        }

    }

    private void close() {
        try {
            rs.close();
            try {
                ps.close();
            } catch (SQLException e) {
                //nothing we can do here
            }
            if (closeConnection) try {
                connection.close();
            } catch (SQLException e) {
                //nothing we can do here
            }
        } catch (SQLException e) {
            //nothing we can do here
        }
    }

    @Override
    public TaskDescriptor next() {
        try {
            String taskId = rs.getString(1);
            String taskState = rs.getString(2);
            String taskBody = rs.getString(3);

            try (ByteArrayInputStream in = new ByteArrayInputStream(taskBody.getBytes())) {
                return TaskDescriptor.load(in);
            } catch (IOException e) {
                throw new RuntimeException("Parse task failed", e);
            }
        } catch (SQLException e) {
            close();
            throw new RuntimeException("Getting task failed", e);
        }
    }
}
