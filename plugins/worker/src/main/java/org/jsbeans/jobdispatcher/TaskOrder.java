package org.jsbeans.jobdispatcher;

import java.util.Comparator;

public enum TaskOrder implements Comparator<TaskDescriptor> {
    TopPriority {
        @Override
        public int compare(TaskDescriptor o1, TaskDescriptor o2) {
            return Integer.compare(o2.getPriority(), o1.getPriority());
        }
    },

    TopExpired {
        @Override
        public int compare(TaskDescriptor o1, TaskDescriptor o2) {
            long cur = System.currentTimeMillis();
            return Long.compare(cur - o2.getStartTimestamp(), cur - o1.getStartTimestamp());
        }
    }
}