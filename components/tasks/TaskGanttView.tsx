
import React, { useMemo, useRef, useEffect, useState } from 'react';
import { Task } from '../../types';

interface TaskGanttViewProps {
    tasks: Task[];
    onTaskClick: (task: Task) => void;
    onAddTaskDependency: (taskId: number, dependsOnId: number) => void;
    onRemoveTaskDependency: (taskId: number, dependsOnId: number) => void;
}

const DAY_WIDTH = 40; 
const ROW_HEIGHT = 50;
const SIDEBAR_WIDTH = 250;

const TaskGanttView: React.FC<TaskGanttViewProps> = ({ tasks, onTaskClick, onAddTaskDependency }) => {
    const ganttContainerRef = useRef<HTMLDivElement>(null);
    const [taskPositions, setTaskPositions] = useState<Map<number, { y: number }>>(new Map());
    const [dependencyDrag, setDependencyDrag] = useState<{ fromId: number; startX: number; startY: number; endX: number; endY: number } | null>(null);


    const sortedTasks = useMemo(() => {
        return [...tasks].sort((a, b) => new Date(a.startDate || 0).getTime() - new Date(b.startDate || 0).getTime());
    }, [tasks]);

    useEffect(() => {
        const positions = new Map<number, { y: number }>();
        sortedTasks.forEach((task, index) => {
            positions.set(task.id, { y: index * ROW_HEIGHT + ROW_HEIGHT / 2 });
        });
        setTaskPositions(positions);
    }, [sortedTasks]);
    
    const { startDate, totalDays } = useMemo(() => {
        if (sortedTasks.length === 0) {
            const today = new Date();
            const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
            return { startDate: monthStart, totalDays: 30 };
        }
        
        const startDates = sortedTasks.map(t => new Date(t.startDate || new Date()).getTime());
        const endDates = sortedTasks.map(t => new Date(t.dueDate).getTime());
        
        const minDate = new Date(Math.min(...startDates));
        minDate.setDate(minDate.getDate() - 2); // Add some padding
        const maxDate = new Date(Math.max(...endDates));
        maxDate.setDate(maxDate.getDate() + 2); // Add some padding

        const diffTime = Math.abs(maxDate.getTime() - minDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return { startDate: minDate, totalDays: diffDays };
    }, [sortedTasks]);

    const dateDiffInDays = (d1: Date, d2: Date) => {
        const diffTime = d2.getTime() - d1.getTime();
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!dependencyDrag || !ganttContainerRef.current) return;
        const rect = ganttContainerRef.current.getBoundingClientRect();
        setDependencyDrag(prev => ({ 
            ...prev!, 
            endX: e.clientX - rect.left - SIDEBAR_WIDTH + ganttContainerRef.current!.scrollLeft, 
            endY: e.clientY - rect.top + ganttContainerRef.current!.scrollTop 
        }));
    };

    const handleMouseUp = () => {
        setDependencyDrag(null);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleMouseDownOnHandle = (e: React.MouseEvent, taskId: number, type: 'start' | 'end') => {
        e.stopPropagation();
        const taskPos = taskPositions.get(taskId);
        if (!taskPos) return;

        const task = sortedTasks.find(t => t.id === taskId)!;
        const taskStart = new Date(task.startDate!);
        const taskEnd = new Date(task.dueDate);

        const handleX = type === 'start' 
            ? dateDiffInDays(startDate, taskStart) * DAY_WIDTH 
            : dateDiffInDays(startDate, taskEnd) * DAY_WIDTH + DAY_WIDTH;

        setDependencyDrag({
            fromId: taskId,
            startX: handleX,
            startY: taskPos.y,
            endX: handleX,
            endY: taskPos.y
        });

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };
    
    const handleMouseUpOnHandle = (e: React.MouseEvent, targetTaskId: number) => {
        e.stopPropagation();
        if (dependencyDrag && dependencyDrag.fromId !== targetTaskId) {
            onAddTaskDependency(targetTaskId, dependencyDrag.fromId);
        }
        handleMouseUp();
    };

    const renderTimelineHeader = () => {
        const headers = [];
        for (let i = 0; i <= totalDays; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            headers.push(
                <div key={i} className={`h-12 flex flex-col items-center justify-center border-r dark:border-slate-700 ${isWeekend ? 'bg-slate-100 dark:bg-slate-800/50' : ''}`} style={{ width: DAY_WIDTH }}>
                    <div className="text-xs text-slate-500">{date.toLocaleDateString('tr-TR', { weekday: 'short' })}</div>
                    <div className="font-semibold">{date.getDate()}</div>
                </div>
            );
        }
        return headers;
    };

    return (
        <div className="w-full overflow-x-auto" ref={ganttContainerRef}>
            <div className="flex" style={{ width: SIDEBAR_WIDTH + totalDays * DAY_WIDTH }}>
                {/* Sidebar */}
                <div style={{ width: SIDEBAR_WIDTH, flexShrink: 0 }} className="border-r dark:border-slate-700">
                    <div className="h-12 flex items-center p-2 font-bold border-b dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">Görev Adı</div>
                    <div className="relative">
                        {sortedTasks.map((task) => (
                            <div key={task.id} className="h-[50px] flex items-center p-2 border-b dark:border-slate-700 truncate" title={task.title}>
                                {task.title}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Gantt Chart */}
                <div className="flex-grow">
                    <div className="flex sticky top-0 z-10 bg-slate-50 dark:bg-slate-900/50 border-b dark:border-slate-700">{renderTimelineHeader()}</div>
                    <div className="relative" style={{ height: sortedTasks.length * ROW_HEIGHT }}>
                        {/* Grid Lines */}
                        {Array.from({ length: totalDays }).map((_, i) => (
                           <div key={i} className="absolute h-full border-r dark:border-slate-700" style={{ left: (i + 1) * DAY_WIDTH, top: 0 }}></div>
                        ))}
                        {sortedTasks.map((_, i) => (
                           <div key={i} className="absolute w-full border-b dark:border-slate-700" style={{ top: (i + 1) * ROW_HEIGHT, left: 0 }}></div>
                        ))}

                        {/* Task Bars */}
                        {sortedTasks.map((task, index) => {
                            if (!task.startDate) return null;
                            const taskStart = new Date(task.startDate);
                            const taskEnd = new Date(task.dueDate);
                            
                            const left = dateDiffInDays(startDate, taskStart) * DAY_WIDTH;
                            const width = (dateDiffInDays(taskStart, taskEnd) + 1) * DAY_WIDTH;
                            const top = index * ROW_HEIGHT + 10;

                            return (
                                <div
                                    key={task.id}
                                    className="group absolute h-8 bg-primary-500 rounded-md flex items-center px-2 text-white text-sm truncate cursor-pointer hover:bg-primary-600"
                                    style={{ left, top, width: Math.max(width, DAY_WIDTH) }}
                                    title={`${task.title} (${task.startDate} - ${task.dueDate})`}
                                    onClick={() => onTaskClick(task)}
                                >
                                    <div 
                                        className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-primary-700 cursor-pointer opacity-0 group-hover:opacity-100"
                                        onMouseDown={(e) => handleMouseDownOnHandle(e, task.id, 'start')}
                                        onMouseUp={(e) => handleMouseUpOnHandle(e, task.id)}
                                    />
                                    {task.title}
                                    <div 
                                        className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-primary-700 cursor-pointer opacity-0 group-hover:opacity-100"
                                        onMouseDown={(e) => handleMouseDownOnHandle(e, task.id, 'end')}
                                        onMouseUp={(e) => handleMouseUpOnHandle(e, task.id)}
                                    />
                                </div>
                            );
                        })}

                        {/* Dependency Lines */}
                        <svg className="absolute top-0 left-0 w-full h-full" style={{ pointerEvents: 'none', width: totalDays * DAY_WIDTH, height: sortedTasks.length * ROW_HEIGHT }}>
                            {sortedTasks.map(task => {
                                if (!task.dependsOn) return null;
                                const taskPos = taskPositions.get(task.id);
                                if (!taskPos || !task.startDate) return null;

                                return task.dependsOn.map(depId => {
                                    const depTask = sortedTasks.find(t => t.id === depId);
                                    if (!depTask || !depTask.startDate) return null;

                                    const depPos = taskPositions.get(depId);
                                    if (!depPos) return null;

                                    const startX = dateDiffInDays(startDate, new Date(depTask.dueDate)) * DAY_WIDTH + DAY_WIDTH;
                                    const endX = dateDiffInDays(startDate, new Date(task.startDate!)) * DAY_WIDTH;

                                    return (
                                        <g key={`${depId}-${task.id}`}>
                                            <path 
                                                d={`M ${startX} ${depPos.y} L ${startX + 10} ${depPos.y} L ${startX + 10} ${taskPos.y} L ${endX} ${taskPos.y}`}
                                                stroke="#f97316"
                                                strokeWidth="2"
                                                fill="none"
                                                markerEnd="url(#arrow)"
                                            />
                                        </g>
                                    );
                                });
                            })}
                             {dependencyDrag && (
                                <path
                                    d={`M ${dependencyDrag.startX} ${dependencyDrag.startY} L ${dependencyDrag.endX} ${dependencyDrag.endY}`}
                                    stroke="#10b981"
                                    strokeWidth="2"
                                    strokeDasharray="5,5"
                                    fill="none"
                                />
                            )}
                            <defs>
                                <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#f97316" />
                                </marker>
                            </defs>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskGanttView;
