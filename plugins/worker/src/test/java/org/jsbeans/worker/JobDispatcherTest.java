package org.jsbeans.worker;

import org.jsbeans.jobdispatcher.JobDispatcher;
import org.jsbeans.jobdispatcher.TaskDescriptor;
import org.jsbeans.jobdispatcher.TaskRegistry;
import org.jsbeans.jobdispatcher.TaskRequest;
import org.junit.Test;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.Assert.assertTrue;

public class JobDispatcherTest {

    static TaskDescriptor createTask(String id) {
        return new TaskDescriptor((put)->{
            put.apply("id", id);
            put.apply("type", "type");
        });
    }

    @Test
    public void testFileTaskRegistry() throws IOException {
        int count = 10;

        Path path = Files.createTempDirectory("tasks");
        JobDispatcher jobDispatcher = JobDispatcher.createFileSystemJobDispatcher(path);
        TaskRegistry taskRegistry = jobDispatcher.getTaskRegistry();
        for (int j = 0; j < count; j++) {
            TaskDescriptor task = createTask("" + j);
            taskRegistry.add(task);
        }

        assertTrue("lookup all",
                taskRegistry.lookup(TaskRequest.anyTask())
                        .map(t->1)
                        .reduce(0, Integer::sum) == count);
        assertTrue("lookup all Queued",
                taskRegistry.lookup(TaskRequest.anyTask(), TaskRegistry.State.Queued)
                        .map(t->1)
                        .reduce(0, Integer::sum) == count);
        assertTrue("lookup all Locked",
                taskRegistry.lookup(TaskRequest.anyTask(), TaskRegistry.State.Locked)
                        .map(t->1)
                        .reduce(0, Integer::sum) == 0);
        assertTrue("lookup all Working",
                taskRegistry.lookup(TaskRequest.anyTask(), TaskRegistry.State.Working)
                        .map(t->1)
                        .reduce(0, Integer::sum) == 0);
        assertTrue("lookup all Failed",
                taskRegistry.lookup(TaskRequest.anyTask(), TaskRegistry.State.Failed)
                        .map(t->1)
                        .reduce(0, Integer::sum) == 0);
        assertTrue("lookup all Completed",
                taskRegistry.lookup(TaskRequest.anyTask(), TaskRegistry.State.Completed)
                        .map(t->1)
                        .reduce(0, Integer::sum) == 0);

        assertTrue("lookup any single",
                taskRegistry.lookupSingle(TaskRequest.anyTask()) != null);

        assertTrue("lookup fixed id",
                taskRegistry.lookup(TaskRequest.byId("1"))
                        .map(t->1)
                        .reduce(0, Integer::sum) == 1);

        assertTrue("lookup fixed id single",
                taskRegistry.lookupSingle(TaskRequest.byId("1")) != null);

        assertTrue("remove fixed 1",
                taskRegistry.remove(TaskRequest.byId("1"))
                        .map(t->1)
                        .reduce(0, Integer::sum) == 1);

        assertTrue("remove single fixed 2",
                taskRegistry.removeSingle(TaskRequest.byId("2")) != null);

        assertTrue("iterate with 2 removed",
                taskRegistry.lookup(TaskRequest.anyTask())
                        .map(t->1)
                        .reduce(0, Integer::sum) == count - 2);

        assertTrue("change state single Queued->Locked",
                taskRegistry.changeState(taskRegistry.lookup(TaskRequest.anyTask()).findFirst().get(), TaskRegistry.State.Queued, TaskRegistry.State.Locked) != null);
        assertTrue("iterate Queued after move",
                taskRegistry.lookup(TaskRequest.anyTask(), TaskRegistry.State.Queued)
                        .map(t->1)
                        .reduce(0, Integer::sum) == count - 3);
        assertTrue("iterate Locked after move",
                taskRegistry.lookup(TaskRequest.anyTask(), TaskRegistry.State.Locked)
                        .filter(t->t.get("state").equals(TaskRegistry.State.Locked.name()))
                        .map(t->1)
                        .reduce(0, Integer::sum) == 1);

        assertTrue("change state single Locked->Working",
                taskRegistry.changeState(taskRegistry.lookup(TaskRequest.anyTask(), TaskRegistry.State.Locked).findFirst().get(), TaskRegistry.State.Locked, TaskRegistry.State.Working) != null);
        assertTrue("iterate Locked after move",
                taskRegistry.lookup(TaskRequest.anyTask(), TaskRegistry.State.Locked)
                        .map(t->1)
                        .reduce(0, Integer::sum) == 0);
        assertTrue("iterate Working after move",
                taskRegistry.lookup(TaskRequest.anyTask(), TaskRegistry.State.Working)
                        .filter(t->t.get("state").equals(TaskRegistry.State.Working.name()))
                        .map(t->1)
                        .reduce(0, Integer::sum) == 1);

    }
}
