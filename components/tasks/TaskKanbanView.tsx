import React, { useState } from 'react';
import { Task, TaskStatus, TaskPriority, Employee } from '../../types';
import { useApp } from '../../context/AppContext';
import { ICONS } from '../../constants';

const KanbanCard: React.FC<{ 
    task: Task; 
    onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: number) => void; 
    onClick: () => void;
}> = ({ task, onDragStart, onClick }) => {
    const { tasks: allTasks, employees } = useApp();

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
            draggable
            onDragStart={(e) => onDragStart(e, task.id)}
            onClick={onClick}
            className="bg-white p-3 mb-3 rounded-md shadow-sm border border-slate-200 dark:bg-dark-card/50 dark:border-dark-border cursor-grab active:cursor-grabbing"
        >
            <div className="flex justify-between items-start">
                <p className="font-bold text-sm text-text-main dark:text-dark-text-main">{task.title}</p>
                 {task.isStarred && <span className="text-yellow-400">{ICONS.starFilled}</span>}
            </div>
            <div className="flex justify-between items-center mt-2 text-xs text-text-secondary dark:text-dark-text-secondary">
                <div className="flex items-center gap-2">
                    {getPriorityIcon(task.priority)}
                    {subtasks.length > 0 && <span>✓ {completedSubtasks}/{subtasks.length}</span>}
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
  onTaskClick: (task: Task) => void;
}> = ({ status, tasks, onDragStart, onDrop, onTaskClick }) => {
    const [isOver, setIsOver] = useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsOver(true); };
    const handleDragLeave = () => setIsOver(false);
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => { onDrop(e, status); setIsOver(false); };

    const statusConfig = {
        [TaskStatus.Todo]: { title: 'Yapılacak', color: 'border-t-slate-500' },
        [TaskStatus.InProgress]: { title: 'Devam Ediyor', color: 'border-t-blue-500' },
        [TaskStatus.Completed]: { title: 'Tamamlandı', color: 'border-t-green-500' },
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex-1 min-w-[300px] bg-slate-100 rounded-lg p-3 transition-colors duration-300 dark:bg-dark-card/30 ${isOver ? 'bg-slate-200 dark:bg-dark-card/60' : ''}`}
        >
            <div className={`p-2 mb-3 rounded-t-md border-t-4 ${statusConfig[status].color}`}>
                <h3 className="font-bold text-text-main dark:text-dark-text-main">{statusConfig[status].title} ({tasks.length})</h3>
            </div>
            <div className="max-h-[calc(100vh-500px)] overflow-y-auto pr-2">
                {tasks.map(task => (
                    <KanbanCard key={task.id} task={task} onDragStart={onDragStart} onClick={() => onTaskClick(task)} />
                ))}
            </div>
        </div>
    );
};

interface TaskKanbanViewProps {
    tasks: Task[]; // These should be top-level tasks for the view
    allTasks: Task[]; // All tasks for context
    onTaskClick: (task: Task) => void;
    onStatusChange: (taskId: number, newStatus: TaskStatus) => void;
}

const TaskKanbanView: React.FC<TaskKanbanViewProps> = ({ tasks, allTasks, onTaskClick, onStatusChange }) => {

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: number) => {
        e.dataTransfer.setData('taskId', taskId.toString());
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: TaskStatus) => {
        const taskId = parseInt(e.dataTransfer.getData('taskId'), 10);
        const task = allTasks.find(t => t.id === taskId);
        if (task && task.status !== newStatus) {
            onStatusChange(taskId, newStatus);
        }
    };

    const statuses = Object.values(TaskStatus);

    return (
        <div className="flex gap-4 overflow-x-auto pb-4">
            {statuses.map(status => (
                <KanbanColumn
                    key={status}
                    status={status}
                    tasks={tasks.filter(t => t.status === status)}
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                    onTaskClick={onTaskClick}
                />
            ))}
        </div>
    );
};

export default TaskKanbanView;
