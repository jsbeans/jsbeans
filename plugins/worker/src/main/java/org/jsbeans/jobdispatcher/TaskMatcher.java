package org.jsbeans.jobdispatcher;

import java.util.Comparator;

public enum TaskMatcher implements Comparator<TaskDescriptor> {
    FieldsEquals {
        @Override
        public int compare(TaskDescriptor task, TaskDescriptor template) {
            if (task != null && TaskDescriptor.checkTemplateMatched(task, template) >= 0) {
                return 0;
            }

            return -1;
        }
    },
    ExpiredAndFieldsEquals{
        @Override
        public int compare(TaskDescriptor task, TaskDescriptor template) {
            if (task != null &&  TaskDescriptor.checkStartTimestampExpired(task) && TaskDescriptor.checkTemplateMatched(task, template) >= 0) {
                return 0;
            }

            return -1;
        }
    }
}
