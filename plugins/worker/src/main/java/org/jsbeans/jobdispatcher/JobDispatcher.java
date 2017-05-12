package org.jsbeans.jobdispatcher;

import org.jsbeans.jobdispatcher.fs.FileTaskRegistry;
import org.jsbeans.jobdispatcher.base.BaseJobDispatcher;
import org.jsbeans.jobdispatcher.jdbc.SqlTaskCollection;
import org.jsbeans.jobdispatcher.jdbc.SqlTaskRegistry;

import java.nio.file.Path;
import java.util.Properties;
import java.util.concurrent.CompletableFuture;
import java.util.function.Function;

/**
 * Диспетчер задач - отвечает исключительно за выделение задачи для обработки из общего пула задач
 * и управление ее состоянием и жизненным циклов. Диспетчер вызывается обработчиком задач, и посредством
 * уведомляется калбеков и фьюч уведомляется о начале обработки, успешном завершение или завершении с ошибкой.
 */
public interface JobDispatcher {

    TaskRegistry getTaskRegistry();

    boolean dispatchSingle(TaskRequest request, Function<DispatchedJob, CompletableFuture<TaskDescriptor>> getFutureExecution);
    int dispatchBatch(TaskRequest request, int size, Function<DispatchedJob, CompletableFuture<TaskDescriptor>> getFutureExecution);

    static JobDispatcher createFileSystemJobDispatcher(Path tasksPath) {
        return new BaseJobDispatcher(
                new FileTaskRegistry(tasksPath));
    }

    static JobDispatcher createSQLJobDispatcher(String jdbcUrl, Properties props) {
        return new BaseJobDispatcher(
                new SqlTaskRegistry(jdbcUrl, props));
    }

    static JobDispatcher createSQLJobDispatcher(String jdbcUrl, Properties props, SqlTaskCollection.SQLConfig sqlConfig) {
        return new BaseJobDispatcher(
                new SqlTaskRegistry(jdbcUrl, props, sqlConfig));
    }
}
