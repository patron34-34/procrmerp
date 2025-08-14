import { Task } from '../types';

export const expandRecurringEvents = (tasks: Task[], viewStartDate: Date, viewEndDate: Date): Task[] => {
    const allEvents: Task[] = [];
    const recurringParents = tasks.filter(t => t.recurrenceRule);

    // Add all non-recurring tasks that fall within the view
    tasks.forEach(task => {
        if (!task.recurrenceRule) {
            const taskStart = task.startDate ? new Date(task.startDate) : new Date(task.dueDate);
            const taskEnd = new Date(task.dueDate);
            if (taskEnd >= viewStartDate && taskStart <= viewEndDate) {
                allEvents.push(task);
            }
        }
    });

    recurringParents.forEach(parentTask => {
        const rule = parentTask.recurrenceRule;
        if (!rule) return;

        const exceptions = parentTask.recurrenceExceptions || [];
        const seriesEndDate = parentTask.endDate ? new Date(parentTask.endDate) : null;
        
        let cursor = new Date(parentTask.startDate || parentTask.dueDate);
        
        // Ensure cursor starts within a reasonable window to avoid infinite loops on past events
        if (cursor < viewStartDate) {
            // Quick jump to near the start of the view window
            const diffDays = Math.floor((viewStartDate.getTime() - cursor.getTime()) / (1000 * 60 * 60 * 24));
            if (rule === 'FREQ=DAILY') {
                cursor.setDate(cursor.getDate() + diffDays - 1); // Start one day before to catch edge cases
            } else if (rule === 'FREQ=WEEKLY') {
                 cursor.setDate(cursor.getDate() + Math.floor(diffDays / 7) * 7);
            }
        }


        while (cursor <= viewEndDate) {
            if (seriesEndDate && cursor > seriesEndDate) {
                break;
            }

            if (cursor >= viewStartDate) {
                const cursorDateString = cursor.toISOString().split('T')[0];
                
                if (!exceptions.includes(cursorDateString)) {
                    const originalStartDate = new Date(parentTask.startDate || parentTask.dueDate);
                    const duration = new Date(parentTask.dueDate).getTime() - originalStartDate.getTime();
                    
                    const instanceStartDate = new Date(cursor);
                    const instanceEndDate = new Date(instanceStartDate.getTime() + duration);

                    // Create a virtual instance
                    allEvents.push({
                        ...parentTask,
                        id: parentTask.id + new Date(cursorDateString).getTime(), // Create a temporary, unique-ish ID for the UI
                        startDate: instanceStartDate.toISOString().split('T')[0],
                        dueDate: instanceEndDate.toISOString().split('T')[0],
                        originalDate: cursorDateString,
                        seriesId: parentTask.id, // Link back to the parent
                        recurrenceRule: undefined, // Instances don't recur themselves
                    });
                }
            }

            if (rule === 'FREQ=DAILY') {
                cursor.setDate(cursor.getDate() + 1);
            } else if (rule === 'FREQ=WEEKLY') {
                cursor.setDate(cursor.getDate() + 7);
            } else {
                break; 
            }
        }
    });

    return allEvents;
};
