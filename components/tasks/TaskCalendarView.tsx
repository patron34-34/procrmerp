
import React, { useState, useMemo } from 'react';
import { Task } from '../../types';
import { getCalendarGrid, getMonthYearText, getWeekdayHeaders, isSameDay } from '../../utils/dateUtils';

interface TaskCalendarViewProps {
    tasks: Task[];
    onTaskClick: (task: Task) => void;
    onDateDrop: (task: Task, newDate: Date) => void;
    onNewTask: (date: Date) => void;
}

const TaskCalendarView: React.FC<TaskCalendarViewProps> = ({ tasks, onTaskClick, onDateDrop, onNewTask }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [dragOverDate, setDragOverDate] = useState<Date | null>(null);
    
    const calendarGrid = useMemo(() => getCalendarGrid(currentDate.getFullYear(), currentDate.getMonth()), [currentDate]);
    const weekdayHeaders = getWeekdayHeaders();

    const getTasksForDay = (day: Date): Task[] => {
        return tasks.filter(task => {
            if (!task.dueDate) return false;
            // Create new Date objects to avoid modifying the original task date
            const taskDueDate = new Date(task.dueDate + 'T00:00:00'); 
            return isSameDay(taskDueDate, day);
        });
    };
    
    const changeMonth = (amount: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + amount);
            return newDate;
        });
    };

    const handleDragStart = (e: React.DragEvent, task: Task) => {
        e.dataTransfer.setData("task", JSON.stringify(task));
    };

    const handleDragOver = (e: React.DragEvent, day: Date) => {
        e.preventDefault();
        setDragOverDate(day);
    };

    const handleDrop = (e: React.DragEvent, day: Date) => {
        e.preventDefault();
        const taskJson = e.dataTransfer.getData("task");
        if (taskJson) {
            const task = JSON.parse(taskJson);
            onDateDrop(task, day);
        }
        setDragOverDate(null);
    };

    return (
        <div className="p-2">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">&lt;</button>
                <h2 className="text-xl font-bold">{getMonthYearText(currentDate)}</h2>
                <button onClick={() => changeMonth(1)} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">&gt;</button>
            </div>
            <div className="grid grid-cols-7 gap-1">
                {weekdayHeaders.map(day => (
                    <div key={day} className="text-center font-semibold text-text-secondary dark:text-dark-text-secondary p-2">{day}</div>
                ))}
                {calendarGrid.flat().map((day, index) => {
                    if (!day) return <div key={index}></div>;

                    const dayTasks = getTasksForDay(day);
                    const isToday = isSameDay(day, new Date());
                    const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                    const isDragOver = dragOverDate && isSameDay(day, dragOverDate);

                    return (
                        <div 
                            key={index}
                            onDragOver={(e) => handleDragOver(e, day)}
                            onDragLeave={() => setDragOverDate(null)}
                            onDrop={(e) => handleDrop(e, day)}
                            onClick={() => onNewTask(day)}
                            className={`border rounded-md p-2 h-32 flex flex-col transition-colors dark:border-dark-border cursor-pointer ${isCurrentMonth ? 'bg-white dark:bg-dark-card/50' : 'bg-slate-50 dark:bg-slate-800/20 text-slate-400'} ${isDragOver ? 'bg-primary-100 dark:bg-primary-900/50' : ''}`}
                        >
                            <span className={`font-semibold self-start ${isToday ? 'bg-primary-500 text-white rounded-full w-7 h-7 flex items-center justify-center' : ''}`}>
                                {day.getDate()}
                            </span>
                            <div className="mt-1 overflow-y-auto text-xs space-y-1">
                                {dayTasks.map((task) => (
                                    <div 
                                        key={task.id} 
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, task)}
                                        onClick={(e) => { e.stopPropagation(); onTaskClick(task); }}
                                        className="p-1 rounded-md text-white truncate bg-purple-500 cursor-pointer"
                                    >
                                    {task.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
export default TaskCalendarView;
