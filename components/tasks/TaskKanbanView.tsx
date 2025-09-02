import React, { useState } from 'react';
import { Task, TaskStatus, TaskPriority } from '../../types';
import { useApp } from '../../context/AppContext';
import { ICONS } from '../../constants';

const KanbanCard: React.FC<{
    task: Task;
    onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: number) => void;
    onClick: () => void;
    canManage: boolean;
}> = ({ task, onDragStart, onClick, canManage }) => {
    const { tasks: allTasks, employees, toggleTaskStar } = useApp();

    const subtasks = allTasks.filter(t => t.parentId === task.id);
    const completedSubtasks = subtasks.filter(t => t.status === TaskStatus.Completed).length;
    const assignee = employees.find(e => e.id === task.assignedToId);

    const getPriorityIcon = (priority: TaskPriority) => {
        const styles: { [key in TaskPriority]: { icon: React.ReactNode, color: string } } = {
            [TaskPriority.Low]: { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>, color: 'text-slate-500' },
            [TaskPriority.Normal]: { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" /></svg>, color: 'text-blue-500' },
            [TaskPriority.High]: { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>, color: 'text-yellow-500' },
        };
        return <span title={priority} className={styles[priority].color}>{styles[priority].icon}</span>;
    };

    return (
        <div
            draggable={canManage}
            onDragStart={(e) => canManage && onDragStart(e, task.id)}
            onClick={onClick}
            className={`bg-card p-3 mb-3 rounded-md shadow-sm border border-border dark:border-dark-border dark:bg-dark-card ${canManage ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}`}
        >
            <div className="flex justify-between items-start">
                <p className="font-semibold text-sm flex-1 pr-2">{task.title}</p>
                <button onClick={(e) => { e.stopPropagation(); toggleTaskStar(task.id); }} className={`text-slate-400 hover:text-yellow-500 ${task.isStarred ? 'text-yellow-400' : ''}`}>
                    {task.isStarred ? ICONS.starFilled : ICONS.starOutline}
                </button>
            </div>

            <div className="flex justify-between items-center mt-3 text-xs text-text-secondary dark:text-dark-text-secondary">
                <div className="flex items-center gap-2">
                    {subtasks.length > 0 && (
                        <span className="flex items-center gap-1" title={`${completedSubtasks}/${subtasks.length} alt görev tamamlandı`}>
                            {ICONS.list}
                            {completedSubtasks}/{subtasks.length}
                        </span>
                    )}
                    {getPriorityIcon(task.priority)}
                </div>
                {assignee && <img src={assignee.avatar} alt={assignee.name} title={assignee.name} className="w-6 h-6 rounded-full" />}
            </div>
        </div>
    );
};

const KanbanColumn: React.FC<{
    status: TaskStatus;
    tasks: Task[];
    onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: number) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => void;
    onCardClick: (task: Task) => void;
    canManage: boolean;
}> = ({ status, tasks, onDragStart, onDrop, onCardClick, canManage }) => {
    const [isOver, setIsOver] = useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (canManage) {
            setIsOver(true);
        }
    };
    const handleDragLeave = () => setIsOver(false);
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        if (canManage) {
            onDrop(e, status);
            setIsOver(false);
        }
    };

    const statusConfig = {
        [TaskStatus.Todo]: { title: 'Yapılacak', color: 'border-t-slate-400' },
        [TaskStatus.InProgress]: { title: 'Devam Ediyor', color: 'border-t-blue-500' },
        [TaskStatus.Completed]: { title: 'Tamamlandı', color: 'border-t-green-500' },
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex-1 min-w-[300px] bg-slate-100 rounded-lg p-3 transition-colors duration-300 dark:bg-dark-sidebar ${isOver ? 'bg-slate-200 dark:bg-slate-800' : ''}`}
        >
            <div className={`p-2 mb-3 rounded-t-md border-t-4 ${statusConfig[status].color}`}>
                <h3 className="font-bold text-text-main dark:text-dark-text-main">{statusConfig[status].title} ({tasks.length})</h3>
            </div>
            <div className="max-h-[calc(100vh-450px)] overflow-y-auto pr-2">
                {tasks.map(task => (
                    <KanbanCard key={task.id} task={task} onDragStart={onDragStart} onClick={() => onCardClick(task)} canManage={canManage} />
                ))}
            </div>
        </div>
    );
};

interface TaskKanbanViewProps {
    tasks: Task[];
    onTaskClick: (task: Task) => void;
    onStatusChange: (taskId: number, newStatus: TaskStatus) => void;
}

const TaskKanbanView: React.FC<TaskKanbanViewProps> = ({ tasks, onTaskClick, onStatusChange }) => {
    const { hasPermission } = useApp();
    const canManageTasks = hasPermission('gorev:yonet');

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: number) => {
        if (canManageTasks) {
            e.dataTransfer.setData('taskId', taskId.toString());
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: TaskStatus) => {
        const taskId = parseInt(e.dataTransfer.getData('taskId'), 10);
        const task = tasks.find(t => t.id === taskId);
        if (task && task.status !== newStatus) {
            onStatusChange(taskId, newStatus);
        }
    };

    const statuses = Object.values(TaskStatus);

    return (
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
            {statuses.map(status => (
                <KanbanColumn
                    key={status}
                    status={status}
                    tasks={tasks.filter(t => t.status === status)}
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                    onCardClick={onTaskClick}
                    canManage={canManageTasks}
                />
            ))}
        </div>
    );
};

export default TaskKanbanView;
