package org.jsbeans.jobdispatcher;

import java.util.Arrays;
import java.util.stream.Stream;

public interface TaskRegistry {
    enum State {

        /**
         * Задача находится в очереди. {@link #Queued}->{@link #Locked}
         */
        Queued,

        /**
         * Задача еще в очереди, но заблокирована для запуска. Если запуска не будет, то задача вернет предыдущее состояние.
         * {@link #Locked}->{@link #Working}, {@link #Locked}->{@link #Queued}
         */
        Locked,

        /**
         * Задача исполняется.
         * {@link #Working}->{@link #Completed}, {@link #Working}->{@link #Failed}
         */
        Working,

        /**
         * Задача успешно завершена.
         */
        Completed,

        /**
         * Задача завершена с ошибкой.
         * {@link #Failed}->{@link #Queued}
         */
        Failed
    }

    void add(TaskDescriptor task);

    Stream<TaskDescriptor> lookup(TaskRequest request, State state);
    Stream<TaskDescriptor> remove(TaskRequest request, State state);

    TaskDescriptor changeState(TaskDescriptor task, State state, State targetState);

    default Stream<TaskDescriptor> remove(TaskRequest request) {
        return Arrays.stream(State.values())
                .flatMap(state -> remove(request, state));
    }

    default Stream<TaskDescriptor> lookup(TaskRequest request)  {
        return Arrays.stream(State.values())
                .flatMap(state -> lookup(request, state));
    }

    default TaskDescriptor removeSingle(TaskRequest request) {
        return remove(request).findFirst().orElse(null);
    }

    default TaskDescriptor removeSingle(TaskRequest request, State state) {
        return remove(request, state).findFirst().orElse(null);
    }

    default TaskDescriptor changeState(TaskDescriptor task, State targetState) {
        return Arrays.stream(State.values())
                .map(state -> changeState(task, state, targetState))
                .findFirst().orElse(null);
    }

    default TaskDescriptor lookupSingle(TaskRequest request) {
        return lookup(request).findFirst().orElse(null);
    }

    default TaskDescriptor lookupSingle(TaskRequest request, State state) {
        return lookup(request, state).findFirst().orElse(null);
    }
}
