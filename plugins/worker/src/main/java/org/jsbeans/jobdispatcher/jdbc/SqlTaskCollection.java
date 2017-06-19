package org.jsbeans.jobdispatcher.jdbc;


import org.jsbeans.jobdispatcher.TaskCollection;
import org.jsbeans.jobdispatcher.TaskDescriptor;
import org.jsbeans.jobdispatcher.TaskRegistry;
import org.jsbeans.jobdispatcher.TaskRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Iterator;
import java.util.Objects;
import java.util.Properties;
import java.util.Spliterators;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

public class SqlTaskCollection implements TaskCollection {

    public static abstract class SQLConfig {
        public String getInitQuery() {
            return "CREATE TABLE IF NOT EXISTS tasks (\n" +
                    "    task_id      char(128) NOT NULL,\n" +
                    "    task_state  char(20) NOT NULL," +
                    "    task_body    varchar(1024) NOT NULL,\n" +
                    "    CONSTRAINT task_key PRIMARY KEY (task_id)\n" +
                    ");\n";
        }

        /** SQL select query with three columns (task_id, task_state, task_body)
         * */
        public String getSelectTaskQuery() {
            return "SELECT task_id, task_state, task_body FROM tasks";
        }

        /** SQL insert query with three parametrized string arguments (task_id, task_state, task_body)
         * */
        public String getInsertTaskQuery() {
            return "INSERT INTO tasks(task_id, task_state, task_body) VALUES (?,?,?)";
        }

        /**
         * SQL delete task query with single string argument task_id
         */
        public String getDeleteTaskQuery() {
            return "DELETE FROM tasks WHERE task_id=?";
        }

    }

    private static final SQLConfig defaultSQLConfig = new SQLConfig() {};

    private final Logger logger = LoggerFactory.getLogger(this.getClass());
    private final TaskRegistry.State state;
    private final String jdbcURL;
    private final Properties props;
    private final SQLConfig sqlConfig;

    public SqlTaskCollection(TaskRegistry.State state, String jdbcURL, Properties props, SQLConfig sqlConfig){
        this.state = state;
        this.jdbcURL = jdbcURL;
        this.props = props;
        this.sqlConfig = sqlConfig != null ? sqlConfig : defaultSQLConfig;
        init();
    }

    private void init() {
        try (Connection connection = DriverManager.getConnection(jdbcURL, props)) {
            try (PreparedStatement st = connection.prepareStatement(sqlConfig.getInitQuery())) {
                st.execute();
            }
        } catch (SQLException e) {
            throw new RuntimeException("Tasks DB initialization failed", e);
        }
    }

    @Override
    public TaskDescriptor add(TaskDescriptor task) {
        try (Connection connection = DriverManager.getConnection(jdbcURL, props)) {
            connection.setAutoCommit(false);
            try (PreparedStatement st = connection.prepareStatement(sqlConfig.getInsertTaskQuery())) {
                st.setString(1, task.getId());
                st.setString(2, task.getState());
                try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
                    TaskDescriptor.write(task, out);
                    st.setString(3, out.toString());
                } catch (IOException e) {
                    throw new RuntimeException("Serialize task failed", e);
                }

                if (st.executeUpdate() != 1) {
                    throw new RuntimeException("Task not stored");
                }
                connection.commit();
                return task;
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Stream<TaskDescriptor> lookup(TaskRequest request) {
        try {
            Connection connection = DriverManager.getConnection(jdbcURL, props);
            Iterator<TaskDescriptor> iterator = new TaskResultSetIterator(connection, true, sqlConfig);
            return StreamSupport.stream(Spliterators.spliteratorUnknownSize(iterator, 0), false)
                    .filter(task -> state.toString().equals(task.getState()))
                    .filter(task -> request.getMatcher().compare(task, request.getTemplate()) == 0)
                    .sorted(request.getOrder());
        } catch (SQLException e) {
            throw new RuntimeException("Select tasks failed", e);
        }
    }

    @Override
    public Stream<TaskDescriptor> remove(TaskRequest request) {
        return lookup(request)
                .map(task -> {
                    if (removeTask(task)) {
                        return task;
                    } else {
                        return null;
                    }
                })
                .filter(Objects::nonNull);
    }

    private boolean removeTask(TaskDescriptor task) {
        try (Connection connection = DriverManager.getConnection(jdbcURL, props)) {
            try (PreparedStatement st = connection.prepareStatement(sqlConfig.getDeleteTaskQuery())) {
                st.setString(1, task.getId());
                return st.executeUpdate() > 0;
            }
        } catch (SQLException e) {
            throw new RuntimeException("Remove task failed", e);
        }
    }
}
